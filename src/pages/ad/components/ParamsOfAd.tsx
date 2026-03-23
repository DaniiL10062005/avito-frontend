import type {
  AutoItemParams,
  ElectronicsItemParams,
  ItemCategory,
  RealEstateItemParams,
} from "@/shared/types/ads";
import type { ReactNode } from "react";
import { NeedsRevision } from "./NeedsRevision";
import { RenderParamRows } from "./RenderParamRows";

interface ParamsOfAdProps {
  params?: AutoItemParams | RealEstateItemParams | ElectronicsItemParams;
  category?: ItemCategory;
  needsRevision?: boolean;
}

type ParamRow = {
  label: string;
  value?: string | number;
};

const isMissingValue = (value?: string | number) =>
  value === undefined || value === null || value === "";

export const ParamsOfAd = (props: ParamsOfAdProps) => {
  const autoParams = props.params as AutoItemParams | undefined;
  const electronicsParams = props.params as ElectronicsItemParams | undefined;
  const realEstateParams = props.params as RealEstateItemParams | undefined;

  const autoRows: ParamRow[] = [
    { label: "Бренд", value: autoParams?.brand },
    { label: "Модель", value: autoParams?.model },
    { label: "Год выпуска", value: autoParams?.yearOfManufacture },
    {
      label: "Коробка передач",
      value:
        autoParams?.transmission === "automatic"
          ? "Автомат"
          : autoParams?.transmission === "manual"
            ? "Механика"
            : undefined,
    },
    {
      label: "Пробег",
      value:
        autoParams?.mileage !== undefined ? `${autoParams.mileage} км` : undefined,
    },
    {
      label: "Мощность двигателя",
      value:
        autoParams?.enginePower !== undefined
          ? `${autoParams.enginePower} л.с.`
          : undefined,
    },
  ];

  const electronicsRows: ParamRow[] = [
    {
      label: "Тип",
      value:
        electronicsParams?.type === "phone"
          ? "Телефон"
          : electronicsParams?.type === "laptop"
            ? "Ноутбук"
            : electronicsParams?.type === "misc"
              ? "Другое"
              : undefined,
    },
    { label: "Бренд", value: electronicsParams?.brand },
    { label: "Модель", value: electronicsParams?.model },
    {
      label: "Состояние",
      value:
        electronicsParams?.condition === "new"
          ? "Новый"
          : electronicsParams?.condition === "used"
            ? "Б/у"
            : undefined,
    },
    { label: "Цвет", value: electronicsParams?.color },
  ];

  const realEstateRows: ParamRow[] = [
    {
      label: "Тип",
      value:
        realEstateParams?.type === "flat"
          ? "Квартира"
          : realEstateParams?.type === "house"
            ? "Дом"
            : realEstateParams?.type === "room"
              ? "Комната"
              : undefined,
    },
    { label: "Адрес", value: realEstateParams?.address },
    {
      label: "Площадь",
      value:
        realEstateParams?.area !== undefined ? `${realEstateParams.area} м²` : undefined,
    },
    { label: "Этаж", value: realEstateParams?.floor },
  ];

  const rowsByCategory: Record<ItemCategory, ParamRow[]> = {
    auto: autoRows,
    electronics: electronicsRows,
    real_estate: realEstateRows,
  };

  const CATEGORY_COMPONENTS: Record<ItemCategory, ReactNode> = {
    auto: RenderParamRows(autoRows),
    electronics: RenderParamRows(electronicsRows),
    real_estate: RenderParamRows(realEstateRows),
  };

  const missingFields = props.category
    ? rowsByCategory[props.category]
        .filter((row) => isMissingValue(row.value))
        .map((row) => row.label)
    : [];

  return (
    <div className="flex gap-8 items-start w-full">
      <img
        src="/placeholder.png"
        alt="placeholder"
        className="aspect-4/3 w-1/3"
      />
      <div className="flex flex-col gap-9">
        {props.needsRevision && missingFields.length > 0 && (
          <NeedsRevision needableParams={missingFields} />
        )}
        <div className="flex flex-col gap-4">
          <p className="font-medium text-[22px] leading-7">Характеристики</p>
          {props.category ? CATEGORY_COMPONENTS[props.category] : ""}
        </div>
      </div>
    </div>
  );
};
