export interface JwtPayLoad {
  id: string;
  email: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

export interface Register {
  fullName: string;
  email: string;
  password: string;
}

export interface Login {
  email: string;
  password: string;
}
