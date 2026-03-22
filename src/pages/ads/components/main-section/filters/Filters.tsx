import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/shared/components/Accordion";
import { Button } from "@/shared/components/Button";
import { Card } from "@/shared/components/Card";
import { Checkbox } from "@/shared/components/Checkbox";
import { Switch } from "@/shared/components/Switch";
import { CATEGORY_LABELS } from "@/shared/constants/category-labels";
import type { ItemCategory } from "@/shared/types/ads";
import { useAdsFiltersStore } from "@/pages/ads/store/useAdsFiltersStore";

export const Filters = () => {
  const categories = useAdsFiltersStore((state) => state.categories);
  const needsRevisionOnly = useAdsFiltersStore(
    (state) => state.needsRevisionOnly,
  );
  const toggleCategory = useAdsFiltersStore((state) => state.toggleCategory);
  const setNeedsRevisionOnly = useAdsFiltersStore(
    (state) => state.setNeedsRevisionOnly,
  );
  const resetFilters = useAdsFiltersStore((state) => state.resetFilters);

  return (
    <div className="flex flex-col gap-2.5">
      <Card className="flex flex-col gap-2.5 w-[256px] p-4">
        <p className="text-base font-medium">Фильтры</p>
        <Accordion type="single" collapsible defaultValue="category">
          <AccordionItem value="category" className="border-none">
            <AccordionTrigger className="text-sm font-normal hover:no-underline">
              Категория
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col gap-5">
                {Object.entries(CATEGORY_LABELS).map(([categoryId, label]) => (
                  <label
                    key={categoryId}
                    htmlFor={categoryId}
                    className="flex cursor-pointer items-center gap-3 text-sm font-normal leading-none"
                  >
                    <Checkbox
                      checked={categories.includes(categoryId as ItemCategory)}
                      id={categoryId}
                      onCheckedChange={() =>
                        toggleCategory(categoryId as ItemCategory)
                      }
                    />
                    <span>{label}</span>
                  </label>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <hr />
        <div className="flex items-center justify-between">
          <p className="font-medium text-sm">Только требующие доработок</p>
          <Switch
            checked={needsRevisionOnly}
            onCheckedChange={setNeedsRevisionOnly}
          />
        </div>
      </Card>
      <Button
        variant="primary"
        className="w-full h-10.25 font-normal"
        onClick={resetFilters}
      >
        Сбросить фильтры
      </Button>
    </div>
  );
};
