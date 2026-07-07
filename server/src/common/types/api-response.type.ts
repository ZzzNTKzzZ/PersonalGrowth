import { HttpStatus } from '@nestjs/common';

export interface ApiResponse<T = any> {
  data: T;
  success: boolean;
  status: HttpStatus | number;
  message?: string;
}
