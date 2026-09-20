import { create } from "zustand";

type AuthState = {
  userId: number | null;
  nickname: string | null;
  accessToken: string | null;
  refreshToken: string | null;

  setAuth: (auth: {
    userId: number;
    nickname: string;
    accessToken: string;
    refreshToken: string;
  }) => void;

  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  userId: Number(localStorage.getItem("userId")) || null,
  nickname: localStorage.getItem("nickname"),
  accessToken: localStorage.getItem("accessToken"),
  refreshToken: localStorage.getItem("refreshToken"),

  setAuth: ({ userId, nickname, accessToken, refreshToken }) => {
    localStorage.setItem("userId", String(userId));
    localStorage.setItem("nickname", nickname);
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);

    set({
      userId,
      nickname,
      accessToken,
      refreshToken,
    });
  },

  logout: () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("nickname");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    set({
      userId: null,
      nickname: null,
      accessToken: null,
      refreshToken: null,
    });
  },
}));
