import {
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { PrismaClient } from '../../../generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';

const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaPg({ connectionString });
const prismaClient = new PrismaClient({ adapter });

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    // 1. Nếu Client gửi Token hợp lệ -> Dùng Token người dùng
    if (token) {
      try {
        const payload = await this.jwtService.verifyAsync(token);
        request['user'] = payload;
        return true;
      } catch (err) {
        // Fallback bên dưới nếu token hết hạn
      }
    }

    // 2. TẮT TẠM AUTH GUARD: Ưu tiên lấy User khanh@gmail.com (chứa dữ liệu Seed)
    try {
      const defaultUser =
        (await prismaClient.user.findFirst({
          where: { email: 'khanh@gmail.com' },
        })) || (await prismaClient.user.findFirst());

      if (defaultUser) {
        request['user'] = { id: defaultUser.id, email: defaultUser.email };
      }
    } catch (e) {
      console.error("Guard DB fallback error:", e);
    }

    return true; // Luôn cho phép truy cập API
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const raw = request.headers.authorization;
    if (!raw) return undefined;
    const parts = raw.trim().split(/\s+/);
    if (parts.length >= 2 && parts[0].toLowerCase() === 'bearer') {
      return parts[1];
    }
    return undefined;
  }
}
