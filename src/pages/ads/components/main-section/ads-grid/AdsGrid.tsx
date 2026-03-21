import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/shared/components/Pagination";
import { cn } from "@/utils/lib/utils";
import { useAdsViewModeStore } from "@/pages/ads/store/useAdsViewModeStore";

import { AdCard, type AdCardProps } from "./AdCard";

const MOCK_ADS: AdCardProps[] = [
  {
    category: "Электроника",
    name: "Наушники",
    price: 2990,
  },
  {
    category: "Авто",
    name: "Volkswagen Polo",
    price: 1100000,
    improvementNeeded: true,
  },
  {
    category: "Недвижимость",
    name: "Студия, 25м²",
    price: 15000000,
  },
  {
    category: "Недвижимость",
    name: "1-кк, 44м²",
    price: 19000000,
    improvementNeeded: true,
  },
  {
    category: "Электроника",
    name: "MacBook Pro 16”",
    price: 64000,
    improvementNeeded: true,
  },
  {
    category: "Авто",
    name: "Omoda C5",
    price: 2900000,
  },
  {
    category: "Электроника",
    name: "iPad Air 11, 2024 г.",
    price: 37000,
  },
  {
    category: "Электроника",
    name: "MAJOR VI",
    price: 20000,
  },
  {
    category: "Авто",
    name: "Toyota Camry",
    price: 3900000,
    improvementNeeded: true,
  },
  {
    category: "Электроника",
    name: "iPhone 17 Pro Max",
    price: 107000,
  },
];

const CARD_WIDTH = 200;
const CARD_GAP = 14;
const GRID_ROWS_PER_PAGE = 2;
const LIST_ITEMS_PER_PAGE = 4;

export const AdsGrid = () => {
  const gridRef = useRef<HTMLDivElement>(null);
  const viewMode = useAdsViewModeStore((state) => state.viewMode);
  const currentPage = useAdsViewModeStore((state) => state.currentPage);
  const setCurrentPage = useAdsViewModeStore((state) => state.setCurrentPage);
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

  const itemsPerPage =
    viewMode === "list"
      ? LIST_ITEMS_PER_PAGE
      : cardsPerRow * GRID_ROWS_PER_PAGE;
  const totalPages = Math.max(1, Math.ceil(MOCK_ADS.length / itemsPerPage));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * itemsPerPage;
  const currentAds = MOCK_ADS.slice(startIndex, startIndex + itemsPerPage);
  const previousPageLabel = "Предыдущая страница";
  const nextPageLabel = "Следующая страница";

  const pageButtonClassName =
    "size-8 rounded-lg border border-[#D9D9D9] bg-white p-0 text-sm font-medium text-[#5C5F66] transition-colors hover:border-[#1677FF] hover:text-[#1677FF]";
  const arrowButtonClassName =
    "size-8 rounded-lg border border-[#D9D9D9] bg-white p-0 text-[#A9ADB8] transition-colors hover:border-[#1677FF] hover:text-[#1677FF] aria-disabled:pointer-events-none aria-disabled:opacity-50";

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-6">
      <div
        ref={gridRef}
        className={cn(
          "w-full",
          viewMode === "list" ? "flex flex-col gap-3" : "flex flex-wrap gap-3.5",
        )}
      >
        {currentAds.map((ad) => (
          <AdCard
            key={`${ad.category}-${ad.name}`}
            {...ad}
            viewMode={viewMode}
          />
        ))}
      </div>

      <Pagination className="justify-start">
        <PaginationContent className="gap-2">
          <PaginationItem>
            <PaginationLink
              href="#"
              aria-label={previousPageLabel}
              aria-disabled={safeCurrentPage === 1}
              className={arrowButtonClassName}
              onClick={(event) => {
                event.preventDefault();
                setCurrentPage(Math.max(safeCurrentPage - 1, 1));
              }}
            >
              <ChevronLeft />
            </PaginationLink>
          </PaginationItem>

          {Array.from({ length: totalPages }, (_, index) => {
            const page = index + 1;

            return (
              <PaginationItem key={page}>
                <PaginationLink
                  href="#"
                  isActive={safeCurrentPage === page}
                  className={pageButtonClassName}
                  onClick={(event) => {
                    event.preventDefault();
                    setCurrentPage(page);
                  }}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            );
          })}

          <PaginationItem>
            <PaginationLink
              href="#"
              aria-label={nextPageLabel}
              aria-disabled={safeCurrentPage === totalPages}
              className={arrowButtonClassName}
              onClick={(event) => {
                event.preventDefault();
                setCurrentPage(Math.min(safeCurrentPage + 1, totalPages));
              }}
            >
              <ChevronRight />
            </PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};
