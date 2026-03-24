import type { AdsViewMode } from "@/pages/ads/store/useAdsViewModeStore";
import { Card } from "@/shared/components/Card";
import { CATEGORY_LABELS } from "@/shared/constants/category-labels";
import type { ItemCategory } from "@/shared/types/ads";
import { cn } from "@/utils/lib/utils";
import { useNavigate } from "react-router";

export interface AdCardProps {
  imageSrc?: string;
  category?: ItemCategory;
  name: string;
  price: number;
  improvementNeeded?: boolean;
  viewMode?: AdsViewMode;
  id: number;
}

export const AdCard = ({
  imageSrc = "placeholder.png",
  category,
  name,
  price,
  improvementNeeded,
  viewMode = "grid",
  id,
}: AdCardProps) => {
  const isListView = viewMode === "list";
  const categoryLabel = category ? CATEGORY_LABELS[category] : "Категория";
  const improvementLabel = "Требует доработок";
  const navigate = useNavigate();

  return (
    <Card
      onClick={() => navigate(`/ads/${id}`)}
      className={cn(
        "gap-0 p-0 hover:translate-y-1 hover:shadow-[0px_3px_6px_-4px_rgba(0,0,0,0.12),0px_6px_16px_rgba(0,0,0,0.08),0px_9px_28px_8px_rgba(0,0,0,0.05)] transition-all duration-300",
        isListView ? "w-full flex-row overflow-hidden" : "w-50 flex-col",
      )}
    >
      <img
        className={cn(
          "object-contain bg-[#FAFAFA]",
          isListView ? "h-auto w-44 shrink-0 px-6 py-4" : "aspect-4/3 w-50",
        )}
        src={imageSrc}
        alt="Placeholder"
      />
      <div
        className={cn(
          "flex flex-col items-start justify-between h-full gap-1",
          isListView ? "px-4 py-4" : "relative px-4 pb-4",
        )}
      >
        <div className="flex flex-col items-start justify-between w-full h-full gap-1">
          {isListView ? (
            <span className="text-sm text-[#8C8C8C]">{categoryLabel}</span>
          ) : (
            <span className="absolute -top-2.5 rounded-md border border-[#D9D9D9] px-3">
              {categoryLabel}
            </span>
          )}
          <p
            className={cn(
              "text-base font-normal leading-6",
              !isListView && "mt-5",
            )}
          >
            {name}
          </p>
          <p className="text-lg font-semibold opacity-45">
            {price}
            {" ₽"}
          </p>
        </div>
        {improvementNeeded && (
          <span className="flex items-center gap-2 rounded-lg bg-[#F9F1E6] px-2 py-px text-sm leading-6 font-normal text-[#FAAD14]">
            <div className="h-1.5 w-1.5 rounded-full bg-[#FAAD14]"></div>
            {improvementLabel}
          </span>
        )}
      </div>
    </Card>
  );
};
