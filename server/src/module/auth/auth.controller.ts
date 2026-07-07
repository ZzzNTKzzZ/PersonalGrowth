import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { LoginDto, RegisterDto, RefreshTokenDto } from './auth.dto.js';
import { JwtAuthGuard } from '../../common/guard/jwt-auth.guard.js';
import { User } from '../../common/decorator/user.decorator.js';
import type { JwtPayLoad } from './auth.type.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.service.register(dto)
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.service.login(dto)
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@User() user: JwtPayLoad) {
    await this.service.logout(user.id);
    return { message: 'Logged out successfully' };
  }

  @Post('refresh')
  async refreshToken(@Body() dto: RefreshTokenDto) {
    return this.service.refreshTokens(dto.refreshToken);
  }
}
