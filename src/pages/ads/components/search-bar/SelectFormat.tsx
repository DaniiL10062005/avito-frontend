import { cn } from "@/utils/lib/utils";
import { LayoutGrid, List } from "lucide-react";
import { useState } from "react";

type ViewMode = "grid" | "list";

export const SelectFormat = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  return (
    <div className="h-8 flex items-center rounded-lg bg-muted p-2">
      <button
        type="button"
        aria-pressed={viewMode === "grid"}
        onClick={() => setViewMode("grid")}
        className="flex items-center justify-center rounded-2xl outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <LayoutGrid
          className={cn(
            "size-4 transition-colors",
            viewMode === "grid" ? "text-primary" : "text-foreground",
          )}
          strokeWidth={2.5}
        />
      </button>
      <div className="mx-2 h-7 w-0.5 bg-white" />
      <button
        type="button"
        aria-pressed={viewMode === "list"}
        onClick={() => setViewMode("list")}
        className="flex items-center justify-center rounded-2xl outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <List
          className={cn(
            "size-4 transition-colors",
            viewMode === "list" ? "text-primary" : "text-foreground",
          )}
          strokeWidth={2.5}
        />
      </button>
    </div>
  );
};
