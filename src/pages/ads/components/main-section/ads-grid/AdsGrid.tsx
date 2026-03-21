import { useEffect, useRef, useState } from "react";

import { useAdsViewModeStore } from "@/pages/ads/store/useAdsViewModeStore";
import { useInfiniteAdsQuery } from "@/shared/api/queries/ads";
import { cn } from "@/utils/lib/utils";

import { AdCard } from "./AdCard";

const CARD_WIDTH = 200;
const CARD_GAP = 14;
const GRID_ROWS_PER_BATCH = 2;
const LIST_ITEMS_PER_BATCH = 8;

export const AdsGrid = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const loadMoreTriggerRef = useRef<HTMLDivElement>(null);
  const viewMode = useAdsViewModeStore((state) => state.viewMode);
  const [cardsPerRow, setCardsPerRow] = useState(1);

  useEffect(() => {
    const gridElement = gridRef.current;

    if (!gridElement) {
      return;
    }

    const updateCardsPerRow = () => {
      const containerWidth = gridElement.clientWidth;
      const nextCardsPerRow = Math.max(
        1,
        Math.floor((containerWidth + CARD_GAP) / (CARD_WIDTH + CARD_GAP)),
      );

      setCardsPerRow(nextCardsPerRow);
    };

    updateCardsPerRow();

    const resizeObserver = new ResizeObserver(updateCardsPerRow);
    resizeObserver.observe(gridElement);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  const batchSize =
    viewMode === "list"
      ? LIST_ITEMS_PER_BATCH
      : cardsPerRow * GRID_ROWS_PER_BATCH;

  const {
    data,
    error,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteAdsQuery({
    batchSize,
    viewMode,
  });

  const ads = data?.pages.flatMap((page) => page.items) ?? [];

  useEffect(() => {
    if (isLoading || isFetchingNextPage || !hasNextPage) {
      return;
    }

    const container = scrollContainerRef.current;
    const trigger = loadMoreTriggerRef.current;

    if (!container || !trigger) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          void fetchNextPage();
        }
      },
      {
        root: container,
        rootMargin: "200px 0px",
      },
    );

    observer.observe(trigger);

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, isLoading]);

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col">
      <div
        ref={scrollContainerRef}
        className="min-h-0 max-h-[calc(100vh-240px)] overflow-y-auto pr-2"
      >
        <div
          ref={gridRef}
          className={cn(
            "w-full",
            viewMode === "list"
              ? "flex flex-col gap-3"
              : "flex flex-wrap gap-3.5",
          )}
        >
          {ads.map((ad) => (
            <AdCard
              key={`${ad.category}-${ad.title}-${ad.price}`}
              category={ad.category}
              name={ad.title}
              price={ad.price}
              improvementNeeded={ad.needsRevision}
              viewMode={viewMode}
            />
          ))}

          {isLoading && (
            <p className="text-sm text-[#8C8C8C]">Загрузка объявлений...</p>
          )}

          {!isLoading && !error && ads.length === 0 && (
            <p className="text-sm text-[#8C8C8C]">Объявления не найдены</p>
          )}

          {error && (
            <p className="text-sm text-red-500">
              Не удалось загрузить объявления
            </p>
          )}

          {!isLoading && ads.length > 0 && hasNextPage && (
            <div ref={loadMoreTriggerRef} className="h-4 w-full">
              {isFetchingNextPage && (
                <p className="text-sm text-[#8C8C8C]">
                  Загружаем еще объявления...
                </p>
              )}
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
