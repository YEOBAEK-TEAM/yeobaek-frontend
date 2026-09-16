import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { login } from "@/api/auth";

import loginIcon from "@/assets/icons/LogIn.png";

import { useAuthStore } from "@/stores/auth";

export default function LoginPage() {
  const navigate = useNavigate();

  const setAuth = useAuthStore((state) => state.setAuth);

  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const isLoginEnabled = nickname.trim() !== "" && password.trim() !== "" && !isLoading;

  const handleLogin = async () => {
    if (!isLoginEnabled) return;

    try {
      setIsLoading(true);
      setErrorMessage("");

      const data = await login({
        nickname: nickname.trim(),
        password,
      });

      setAuth(data);

      navigate("/home");
    } catch (error) {
      console.error("로그인 실패", error);

      setErrorMessage("닉네임 또는 비밀번호를 확인해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main
      className="mx-auto min-h-dvh w-full max-w-97.5 bg-[#F7F6F1] px-11"
      style={{
        fontFamily:
          '"Pretendard", "Noto Sans KR", "Apple SD Gothic Neo", "Malgun Gothic", sans-serif',
      }}
    >
      {/* LOGIN 이미지 */}
      <div className="flex justify-center pt-[18.5vh]">
        <img src={loginIcon} alt="Login" draggable={false} className="w-28 object-contain" />
      </div>

      {/* 로그인 폼 */}
      <form
        className="mt-9"
        onSubmit={(event) => {
          event.preventDefault();
          void handleLogin();
        }}
      >
        {/* 닉네임 */}
        <div>
          <label
            htmlFor="nickname"
            className="mb-4 block text-[16px] font-medium leading-none text-[#555555]"
          >
            닉네임 / ID
          </label>

          <input
            id="nickname"
            type="text"
            value={nickname}
            onChange={(event) => setNickname(event.target.value)}
            placeholder="닉네임을 입력하시오"
            autoComplete="username"
            className="
              h-14 w-full
              rounded-[10px]
              border border-[#555555]
              bg-transparent px-5
              text-[15px] font-normal text-[#555555]
              outline-none
              placeholder:font-normal placeholder:text-[#B9B9B9]
              focus:border-[#555555]
            "
          />
        </div>

        {/* 비밀번호 */}
        <div className="mt-4.5">
          <label
            htmlFor="password"
            className="mb-4 block text-[16px] font-medium leading-none text-[#555555]"
          >
            비밀번호 / Password
          </label>

          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="비밀번호를 입력하시오"
            autoComplete="current-password"
            className="
              h-14 w-full
              rounded-[10px]
              border border-[#555555]
              bg-transparent px-5
              text-[15px] font-normal text-[#555555]
              outline-none
              placeholder:font-normal placeholder:text-[#B9B9B9]
              focus:border-[#555555]
            "
          />
        </div>

        {/* 로그인 실패 메시지 */}
        {errorMessage && <p className="mt-3 text-sm text-red-500">{errorMessage}</p>}

        {/* 로그인 버튼 */}
        <button
          type="submit"
          disabled={!isLoginEnabled}
          className="
            mt-7 h-14 w-full
            rounded-[10px]
            border border-[#555555]
            bg-[#C0C99E]
            text-[17px] font-semibold text-[#4F4F4F]
            disabled:cursor-default disabled:opacity-60
          "
        >
          {isLoading ? "로그인 중..." : "로그인 하기"}
        </button>
      </form>
    </main>
  );
}
