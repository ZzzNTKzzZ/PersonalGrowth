import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { UserRepository } from "./user.repository.js";
import { UpdateProfileDto, UpdateSettingsDto, ChangePasswordDto } from "./user.dto.js";
import { UserResponse } from "./user.type.js";
import bcrypt from "bcrypt";

@Injectable()
export class UserService {
  constructor(private readonly repository: UserRepository) {}

  async getMe(userId: string): Promise<UserResponse> {
    const user = await this.repository.findById(userId);
    if (!user) {
      throw new HttpException("User not found", HttpStatus.NOT_FOUND);
    }
    return this.mapToUserResponse(user);
  }

  async updateProfile(dto: UpdateProfileDto, userId: string): Promise<UserResponse> {
    const user = await this.repository.updateProfile(dto, userId);
    if (!user) {
      throw new HttpException("User not found", HttpStatus.NOT_FOUND);
    }
    return this.mapToUserResponse(user);
  }

  async updateSetting(dto: UpdateSettingsDto, userId: string): Promise<UserResponse> {
    const user = await this.repository.updateSetting(dto, userId);
    if (!user) {
      throw new HttpException("User not found", HttpStatus.NOT_FOUND);
    }
    return this.mapToUserResponse(user);
  }

  async changePassword(dto: ChangePasswordDto, userId: string): Promise<void> {
    const user = await this.repository.findById(userId);
    if (!user) {
      throw new HttpException("User not found", HttpStatus.UNAUTHORIZED);
    }

    const isPasswordValid = await bcrypt.compare(dto.currentPassword, user.password);
    if (!isPasswordValid) {
      throw new HttpException("Invalid current password", HttpStatus.UNAUTHORIZED);
    }

    if (dto.currentPassword === dto.newPassword) {
      throw new HttpException(
        "New password cannot be the same as current password",
        HttpStatus.BAD_REQUEST
      );
    }

    if (dto.newPassword !== dto.confirmPassword) {
      throw new HttpException("Passwords do not match", HttpStatus.BAD_REQUEST);
    }

    const hashedPassword = await bcrypt.hash(dto.newPassword, 10);
    await this.repository.updatePassword(userId, hashedPassword);
  }

  private mapToUserResponse(user: any): UserResponse {
    return {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
      profile: user.profile
        ? {
            fullName: user.profile.fullName,
            avatar: user.profile.avatar,
            birthday: user.profile.birthday,
            gender: user.profile.gender,
            theme: user.profile.theme,
            timezone: user.profile.timezone,
          }
        : null,
    };
  }
}
