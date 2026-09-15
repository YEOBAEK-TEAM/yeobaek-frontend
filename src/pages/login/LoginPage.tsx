import { useState } from "react";
import { useNavigate } from "react-router-dom";

import loginIcon from "@/assets/icons/LogIn.png";

export default function LoginPage() {
  const navigate = useNavigate();

  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");

  const isLoginEnabled = nickname.trim() !== "" && password.trim() !== "";

  const handleLogin = () => {
    if (!isLoginEnabled) return;

    // API 로그인 연동 후 변경
    navigate("/home");
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
          handleLogin();
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
            disabled:cursor-default
          "
        >
          로그인 하기
        </button>
      </form>
    </main>
  );
}
