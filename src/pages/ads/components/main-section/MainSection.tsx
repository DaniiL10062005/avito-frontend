import { AdsGrid } from "./ads-grid/AdsGrid";
import { Filters } from "./filters/Filters";

export const MainSection = () => {
  return (
    <div className="flex min-h-0 items-start gap-6">
      <Filters />
      <AdsGrid />
    </div>
  );
};
