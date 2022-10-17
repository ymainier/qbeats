import create from "zustand";

type QBeatsState = {
  score: number;
  indentScore: () => void;
  resetScore: () => void;
};

export const useQBeatsStore = create<QBeatsState>((set) => ({
  score: 0,
  indentScore: () => set((state) => ({ score: state.score + 1 })),
  resetScore: () => set({ score: 0 }),
}));
