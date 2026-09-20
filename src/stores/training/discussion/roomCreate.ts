import { create } from "zustand";

import type {
  CreatedRoom,
  DiscussionTopicView,
  RoomCreateForm,
  RoomVisibility,
} from "@/types/training/discussion/room";

type RoomCreateState = RoomCreateForm & {
  createdRoom: CreatedRoom | null;

  setTopic: (topic: DiscussionTopicView) => void;
  setTitle: (title: string) => void;
  addTag: (tag: string) => void;
  removeTag: (tag: string) => void;
  setDescription: (description: string) => void;
  setVisibility: (visibility: RoomVisibility) => void;
  complete: (createdRoom: CreatedRoom) => void;
  clearForm: () => void;
  reset: () => void;
};

const INITIAL_FORM: RoomCreateForm = {
  topic: null,
  title: "",
  tags: [],
  description: "",
  visibility: "public",
};

export const useRoomCreateStore = create<RoomCreateState>((set) => ({
  ...INITIAL_FORM,
  createdRoom: null,

  setTopic: (topic) => set({ topic }),

  setTitle: (title) => set({ title }),

  addTag: (tag) =>
    set((state) => (state.tags.includes(tag) ? state : { tags: [...state.tags, tag] })),

  removeTag: (tag) => set((state) => ({ tags: state.tags.filter((item) => item !== tag) })),

  setDescription: (description) => set({ description }),

  setVisibility: (visibility) => set({ visibility }),

  complete: (createdRoom) => set({ createdRoom }),

  clearForm: () => set(INITIAL_FORM),

  reset: () => set({ ...INITIAL_FORM, createdRoom: null }),
}));
