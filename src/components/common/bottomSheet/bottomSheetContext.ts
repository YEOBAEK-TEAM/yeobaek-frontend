import { createContext, useContext } from "react";

// 시트 닫기 요청 함수
export type RequestClose = (afterClose?: () => void) => void;

export const BottomSheetCloseContext = createContext<RequestClose>(() => {});

export const useBottomSheetClose = () => useContext(BottomSheetCloseContext);
