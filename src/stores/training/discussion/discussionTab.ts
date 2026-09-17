import { create } from "zustand";

import type { DiscussionSubTab } from "@/types/training/discussion/discussion";

type DiscussionTabState = {
  activeSubTab: DiscussionSubTab;
  setActiveSubTab: (tab: DiscussionSubTab) => void;
};

export const useDiscussionTabStore = create<DiscussionTabState>((set) => ({
  activeSubTab: "recommend",
  setActiveSubTab: (activeSubTab) => set({ activeSubTab }),
}));
