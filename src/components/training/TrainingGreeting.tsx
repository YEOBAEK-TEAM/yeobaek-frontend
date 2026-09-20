import { myProfile } from "@/mocks/my";
import { useAuthStore } from "@/stores/auth";

export default function TrainingGreeting() {
  // 로그인 사용자 닉네임
  const nickname = useAuthStore((state) => state.nickname) ?? myProfile.nickname;

  return (
    <section>
      <h2 className="text-xl font-bold text-[#4F4D4E]">{nickname}님 좋은 아침입니다</h2>

      <p className="mt-2 text-sm leading-relaxed font-semibold whitespace-pre-line text-[#54555A]">
        {"오늘의 공백엔 어떤 생각이 채워질까요? 읽고 생각하며\n문해력 훈련을 시작해보세요"}
      </p>
    </section>
  );
}
