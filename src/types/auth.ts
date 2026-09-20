export type SimpleLoginRequest = {
  nickname: string;
  password: string;
};

export type SimpleLoginResponse = {
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
