import { create } from "zustand";

import type { FolderTabId } from "@/types/home/home";

type FolderBannerState = {
  activeTab: FolderTabId;
  setActiveTab: (tab: FolderTabId) => void;
};

export const useFolderBannerStore = create<FolderBannerState>((set) => ({
  activeTab: "reading",
  setActiveTab: (activeTab) => set({ activeTab }),
}));
