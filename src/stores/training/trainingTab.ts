import { create } from "zustand";

import type { TrainingTab } from "@/types/training/trainingProgram";

type TrainingState = {
  activeTab: TrainingTab;
  setActiveTab: (tab: TrainingTab) => void;
};

export const useTrainingStore = create<TrainingState>((set) => ({
  activeTab: "lity",
  setActiveTab: (activeTab) => set({ activeTab }),
}));
