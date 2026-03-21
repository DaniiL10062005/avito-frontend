import { useEffect, useRef, useState } from "react";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/shared/components/Pagination";

import { AdCard, type AdCardProps } from "./AdCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
const ROWS_PER_PAGE = 2;

export const AdsGrid = () => {
  const gridRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(ROWS_PER_PAGE);

  useEffect(() => {
    const gridElement = gridRef.current;

    if (!gridElement) {
      return;
    }

    const updateItemsPerPage = () => {
      const containerWidth = gridElement.clientWidth;
      const cardsPerRow = Math.max(
        1,
        Math.floor((containerWidth + CARD_GAP) / (CARD_WIDTH + CARD_GAP)),
      );

      setItemsPerPage(cardsPerRow * ROWS_PER_PAGE);
    };

    updateItemsPerPage();

    const resizeObserver = new ResizeObserver(updateItemsPerPage);
    resizeObserver.observe(gridElement);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  const totalPages = Math.max(1, Math.ceil(MOCK_ADS.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentAds = MOCK_ADS.slice(startIndex, startIndex + itemsPerPage);

  const pageButtonClassName =
    "size-8 rounded-lg border border-[#D9D9D9] bg-white p-0 text-sm font-medium text-[#5C5F66] transition-colors hover:border-[#1677FF] hover:text-[#1677FF]";
  const arrowButtonClassName =
    "size-8 rounded-lg border border-[#D9D9D9] bg-white p-0 text-[#A9ADB8] transition-colors hover:border-[#1677FF] hover:text-[#1677FF] aria-disabled:pointer-events-none aria-disabled:opacity-50";

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentPage((page) => Math.min(page, totalPages));
  }, [totalPages]);

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-6">
      <div ref={gridRef} className="flex flex-wrap gap-3.5">
        {currentAds.map((ad) => (
          <AdCard key={`${ad.category}-${ad.name}`} {...ad} />
        ))}
      </div>

      <Pagination className="justify-start">
        <PaginationContent className="gap-2">
          <PaginationItem>
            <PaginationLink
              href="#"
              aria-label="Предыдущая страница"
              aria-disabled={currentPage === 1}
              className={arrowButtonClassName}
              onClick={(event) => {
                event.preventDefault();
                setCurrentPage((page) => Math.max(page - 1, 1));
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
                  isActive={currentPage === page}
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
              aria-label="Следующая страница"
              aria-disabled={currentPage === totalPages}
              className={arrowButtonClassName}
              onClick={(event) => {
                event.preventDefault();
                setCurrentPage((page) => Math.min(page + 1, totalPages));
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
