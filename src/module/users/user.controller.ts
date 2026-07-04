import { Body, Controller, Get, Patch, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service.js";
import { JwtAuthGuard } from "../../common/guard/jwt-auth.guard.js";
import { User } from "../../common/decorator/user.decorator.js";
import { UpdateProfileDto, UpdateSettingsDto, ChangePasswordDto } from "./user.dto.js";
import type { JwtPayLoad } from "../auth/auth.type.js";
import type { UserResponse } from "./user.type.js";

@Controller("users")
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly service: UserService) {}

  @Get("me")
  async me(@User() user: JwtPayLoad): Promise<UserResponse> {
    return this.service.getMe(user.id);
  }

  @Patch("profile")
  async updateProfile(
    @Body() dto: UpdateProfileDto,
    @User() user: JwtPayLoad
  ): Promise<UserResponse> {
    return this.service.updateProfile(dto, user.id);
  }

  @Patch("settings")
  async updateSetting(
    @Body() dto: UpdateSettingsDto,
    @User() user: JwtPayLoad
  ): Promise<UserResponse> {
    return this.service.updateSetting(dto, user.id);
  }

  @Patch("password")
  async changePassword(
    @Body() dto: ChangePasswordDto,
    @User() user: JwtPayLoad
  ): Promise<{ message: string }> {
    await this.service.changePassword(dto, user.id);
    return { message: "Password updated successfully" };
  }
}
