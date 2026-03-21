import { create } from "zustand";

export type AdsViewMode = "grid" | "list";

interface AdsViewModeStore {
  viewMode: AdsViewMode;
  currentPage: number;
  setViewMode: (viewMode: AdsViewMode) => void;
  setCurrentPage: (
    currentPage: number | ((currentPage: number) => number),
  ) => void;
}

export const useAdsViewModeStore = create<AdsViewModeStore>((set) => ({
  viewMode: "grid",
  currentPage: 1,
  setViewMode: (viewMode) => set({ viewMode, currentPage: 1 }),
  setCurrentPage: (currentPage) =>
    set((state) => ({
      currentPage:
        typeof currentPage === "function"
          ? currentPage(state.currentPage)
          : currentPage,
    })),
}));
