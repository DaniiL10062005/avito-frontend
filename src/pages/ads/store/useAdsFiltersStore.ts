import { create } from "zustand";

import type { GetItemsQueryParams, ItemCategory } from "@/shared/types/ads";

type SortOption = {
  sortColumn: NonNullable<GetItemsQueryParams["sortColumn"]>;
  sortDirection: NonNullable<GetItemsQueryParams["sortDirection"]>;
};

interface AdsFiltersStore {
  searchQuery: string;
  categories: ItemCategory[];
  needsRevisionOnly: boolean;
  sortOption: SortOption;
  setSearchQuery: (value: string) => void;
  toggleCategory: (category: ItemCategory) => void;
  setNeedsRevisionOnly: (value: boolean) => void;
  setSortOption: (value: SortOption) => void;
  resetFilters: () => void;
  getQueryParams: () => Omit<GetItemsQueryParams, "limit" | "skip">;
}

export const useAdsFiltersStore = create<AdsFiltersStore>((set, get) => ({
  searchQuery: "",
  categories: [],
  needsRevisionOnly: false,
  sortOption: {
    sortColumn: "createdAt",
    sortDirection: "desc",
  },
  setSearchQuery: (value) => set({ searchQuery: value }),
  toggleCategory: (category) =>
    set((state) => {
      const nextCategories = state.categories.includes(category)
        ? state.categories.filter((item) => item !== category)
        : [...state.categories, category].sort();

      return {
        categories: nextCategories,
      };
    }),
  setNeedsRevisionOnly: (value) => set({ needsRevisionOnly: value }),
  setSortOption: (value) => set({ sortOption: value }),
  resetFilters: () =>
    set({
      searchQuery: "",
      categories: [],
      needsRevisionOnly: false,
      sortOption: {
        sortColumn: "createdAt",
        sortDirection: "desc",
      },
    }),
  getQueryParams: () => {
    const { searchQuery, categories, needsRevisionOnly, sortOption } = get();

    return {
      ...(searchQuery.trim() ? { q: searchQuery.trim() } : {}),
      ...(categories.length > 0 ? { categories } : {}),
      ...(needsRevisionOnly ? { needsRevision: true as const } : {}),
      sortColumn: sortOption.sortColumn,
      sortDirection: sortOption.sortDirection,
    };
  },
}));
