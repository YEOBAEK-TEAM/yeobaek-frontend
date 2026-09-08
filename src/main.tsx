import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "@/App";
import "@/index.css";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* TanStack Query 설정, 서버에서 받아오는 데이터관리 라이브러리*/}
    <QueryClientProvider client={queryClient}>
      <App />
      {/* React Query 개발 도구, 캐시된 데이터, API 호출 정보 확인가능 
        나중에 연동할때 쓰면 좋을듯욤
        <ReactQueryDevtools initialIsOpen={false} />
      */}
    </QueryClientProvider>
  </StrictMode>,
);
