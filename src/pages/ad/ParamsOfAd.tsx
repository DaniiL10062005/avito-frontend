import type {
  AutoItemParams,
  ElectronicsItemParams,
  ItemCategory,
  RealEstateItemParams,
} from "@/shared/types/ads";
import type { ReactNode } from "react";

interface ParamsOfAdProps {
  params?: AutoItemParams | RealEstateItemParams | ElectronicsItemParams;
  category?: ItemCategory;
}
export const ParamsOfAd = (props: ParamsOfAdProps) => {
  const CATEGORY_COMPONENTS: Record<ItemCategory, ReactNode> = {
    auto: (
      <div className="flex flex-col gap-1.5 min-w-57.5">
        {props.params?.brand && (
          <div className="flex items-center justify-between">
            <span className="font-semibold opacity-45">Бренд</span>
            <span>{props.params?.brand}</span>
          </div>
        )}
      </div>
    ),
    electronics: <div></div>,
    real_estate: <div></div>,
  };

  return (
    <div className="flex gap-8 items-start w-full">
      <img
        src="/placeholder.png"
        alt="placeholder"
        className="aspect-4/3 w-1/3"
      />
      <div className="flex flex-col gap-9">
        <div className="flex flex-col gap-4">
          <p className="font-medium text-[22px] leading-7">Характеристики</p>
          {props.category ? CATEGORY_COMPONENTS[props.category] : ""}
        </div>
      </div>
    </div>
  );
};
