import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AuthService } from '../../module/auth/auth.service.js';

@Injectable()
export class TokenInterceptor implements NestInterceptor {
  constructor(private readonly authService: AuthService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    return next.handle().pipe(
      switchMap(async (data) => {
        // Nếu không có dữ liệu trả về hoặc không có id, bỏ qua không chèn token
        if (!data || !data.id) {
          return data;
        }

        // Tối ưu: Chỉ sinh token mới nếu token hiện tại sắp hết hạn (còn dưới 60 giây)
        if (user && user.exp) {
          const currentTimestamp = Math.floor(Date.now() / 1000);
          const timeToLive = user.exp - currentTimestamp;
          if (timeToLive > 60) {
            return data;
          }
        }

        const payload = {
          id: data.id,
          email: data.email,
        };

        // Sinh bộ đôi tokens mới
        const tokens = await this.authService.generateTokens(payload);

        // Lưu refresh token đã mã hóa xuống DB
        await this.authService.updateUserRefreshToken(data.id, tokens.refreshToken);

        // Trả về dữ liệu gốc kèm theo access token & refresh token
        return {
          ...data,
          ...tokens,
        };
      })
    );
  }
}
