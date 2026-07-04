import { Gender, Theme } from "../../../generated/prisma/enums.js";

export interface Profile {
  fullName?: string;
  avatar?: string;
  birthday?: Date;
  gender?: Gender;
}

export interface Setting {
  timezone?: string;
  theme?: Theme;
}

export interface UserResponse {
  id: string;
  email: string;
  createdAt: Date;
  profile: {
    fullName: string | null;
    avatar: string | null;
    birthday: Date | null;
    gender: Gender | null;
    theme: Theme;
    timezone: string;
  } | null;
}
