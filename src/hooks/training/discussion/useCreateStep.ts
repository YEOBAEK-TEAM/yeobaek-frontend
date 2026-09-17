import { useNavigate, useSearchParams } from "react-router-dom";

export type CreateStep = 1 | 2;

// 단계마다 history를 쌓아 브라우저 뒤로가기로 이전 단계 이동
export const useCreateStep = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const step: CreateStep = params.get("step") === "2" ? 2 : 1;

  return {
    step,
    goNext: () => navigate({ search: "?step=2" }),
    goBack: () => navigate(-1),
  };
};
