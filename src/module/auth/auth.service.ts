import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import AuthRepository from './auth.repository.js';
import { RegisterDto, LoginDto } from './auth.dto.js';
import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthResponse, JwtPayLoad } from './auth.type.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly repository: AuthRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async generateAccessToken(payload: JwtPayLoad): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_ACCESS_SECRET') ?? this.configService.get<string>('JWT_SECRET') ?? 'fallbackSecretKey',
      expiresIn: (this.configService.get<string>('ACCESS_TOKEN_TIME') ?? this.configService.get<string>('JWT_EXPIRES_IN') ?? '15m') as any,
    });
  }

  async generateTokens(payload: JwtPayLoad): Promise<AuthResponse> {
    const [accessToken, refreshToken] = await Promise.all([
      this.generateAccessToken(payload),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET') ?? 'fallbackRefreshSecret',
        expiresIn: '7d',
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async register(dto: RegisterDto) {
    const existing = await this.repository.findByEmail(dto.email);
    if (existing) throw new HttpException("Conflict", HttpStatus.CONFLICT);

    const password = await bcrypt.hash(dto.password, 10);

    const user = await this.repository.create({
      ...dto,
      password,
    });

    const payload: JwtPayLoad = {
      id: user.id,
      email: user.email,
    };

    const tokens = await this.generateTokens(payload);
    const hashedRefreshToken = await bcrypt.hash(tokens.refreshToken, 10);
    await this.repository.updateRefreshToken(user.id, hashedRefreshToken);

    return tokens;
  }

  async login(dto: LoginDto) {
    const user = await this.repository.findByEmail(dto.email);
    if (!user) throw new HttpException("Invalid credentials", HttpStatus.UNAUTHORIZED);

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) throw new HttpException("Invalid credentials", HttpStatus.UNAUTHORIZED);

    const payload: JwtPayLoad = {
      id: user.id,
      email: user.email,
    };

    const tokens = await this.generateTokens(payload);
    const hashedRefreshToken = await bcrypt.hash(tokens.refreshToken, 10);
    await this.repository.updateRefreshToken(user.id, hashedRefreshToken);

    return tokens;
  }

  async refreshTokens(refreshToken: string): Promise<AuthResponse> {
    try {
      const secret = this.configService.get<string>('JWT_REFRESH_SECRET') ?? 'fallbackRefreshSecret';
      const payload = await this.jwtService.verifyAsync<JwtPayLoad>(refreshToken, { secret });
      
      const user = await this.repository.findById(payload.id);
      if (!user || !user.hashedRefreshToken) {
        throw new HttpException('Access Denied', HttpStatus.FORBIDDEN);
      }

      const isRefreshTokenValid = await bcrypt.compare(refreshToken, user.hashedRefreshToken);
      if (!isRefreshTokenValid) {
        throw new HttpException('Access Denied', HttpStatus.FORBIDDEN);
      }

      const newPayload: JwtPayLoad = {
        id: user.id,
        email: user.email,
      };

      const tokens = await this.generateTokens(newPayload);
      const hashedRefreshToken = await bcrypt.hash(tokens.refreshToken, 10);
      await this.repository.updateRefreshToken(user.id, hashedRefreshToken);

      return tokens;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException('Invalid or expired refresh token', HttpStatus.UNAUTHORIZED);
    }
  }

  async logout(userId: string): Promise<void> {
    await this.repository.updateRefreshToken(userId, null);
  }

  async updateUserRefreshToken(userId: string, refreshToken: string): Promise<void> {
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.repository.updateRefreshToken(userId, hashedRefreshToken);
  }
}
