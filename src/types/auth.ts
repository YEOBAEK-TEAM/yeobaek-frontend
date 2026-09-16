export type LoginRequest = {
  nickname: string;
  password: string;
};

export type LoginResponse = {
  userId: number;
  nickname: string;
  accessToken: string;
  refreshToken: string;
};

export type ApiResponse<T> = {
  success: boolean;
  code: number;
  message: string;
  data: T;
};
