import { Search } from "lucide-react";

import { useAdsFiltersStore } from "@/pages/ads/store/useAdsFiltersStore";
import { Card } from "@/shared/components/Card";
import { Input } from "@/shared/components/Input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/Select";

import { SelectFormat } from "./SelectFormat";

const SORT_OPTIONS = [
  {
    value: "title-asc",
    label: "По названию: А → Я",
  },
  {
    value: "title-desc",
    label: "По названию: Я → А",
  },
  {
    value: "createdAt-desc",
    label: "По новизне: сначала новые",
  },
  {
    value: "createdAt-asc",
    label: "По новизне: сначала старые",
  },
] as const;

export const Searchbar = () => {
  const searchQuery = useAdsFiltersStore((state) => state.searchQuery);
  const setSearchQuery = useAdsFiltersStore((state) => state.setSearchQuery);
  const sortOption = useAdsFiltersStore((state) => state.sortOption);
  const setSortOption = useAdsFiltersStore((state) => state.setSortOption);
  const sortValue = `${sortOption.sortColumn}-${sortOption.sortDirection}`;

  return (
    <Card className="flex flex-row items-center gap-6">
      <Input
        value={searchQuery}
        onChange={(event) => setSearchQuery(event.target.value)}
        placeholder="Найти объявление..."
        endIcon={<Search className="size-3" />}
      />
      <div className="flex items-center gap-4">
        <SelectFormat />
        <div className="flex h-8 items-center rounded-lg bg-muted p-1">
          <Select
            value={sortValue}
            onValueChange={(value) => {
              const [sortColumn, sortDirection] = value.split("-") as [
                "title" | "createdAt",
                "asc" | "desc",
              ];

              setSortOption({
                sortColumn,
                sortDirection,
              });
            }}
          >
            <SelectTrigger className="h-6! w-60 text-sm">
              <SelectValue placeholder="Сортировка" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {SORT_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
    </Card>
  );
};
