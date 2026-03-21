import { Filters } from "./filters/Filters";

export const MainSection = () => {
  return (
    <div className="flex items-start gap-6">
      <Filters />
      <div className="flex-1" />
    </div>
  );
};
