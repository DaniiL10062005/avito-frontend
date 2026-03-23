import { useEffect, useState } from "react";
import { X } from "lucide-react";

import { useItemQuery } from "@/shared/api/queries/ads";
import { Input } from "@/shared/components/Input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/Select";
import { CATEGORY_LABELS } from "@/shared/constants/category-labels";
import type {
  AutoItemParams,
  ElectronicsItemParams,
  ItemCategory,
  RealEstateItemParams,
} from "@/shared/types/ads";
import { Textarea } from "@/shared/components/Textarea";
import { Button } from "@/shared/components/Button";

type ParamKey =
  | keyof AutoItemParams
  | keyof ElectronicsItemParams
  | keyof RealEstateItemParams;

type FieldConfig = {
  key: ParamKey;
  label: string;
  type: "input" | "select";
  placeholder?: string;
  options?: { value: string; label: string }[];
};

interface FormProps {
  id: number;
}

const baseInputClassName =
  "h-5.5 flex-1 px-0 py-0 text-sm leading-5.5 text-black/85 placeholder:text-black/25";

const baseInputWrapperClassName =
  "h-8 w-[456px] gap-1 rounded-lg border border-[#D9D9D9] bg-white px-3 py-[5px] focus-within:border-[#40A9FF] focus-within:shadow-[0px_0px_0px_2px_rgba(24,144,255,0.2)]";

const baseSelectTriggerClassName =
  "h-8! w-[456px] rounded-lg border border-[#D9D9D9] bg-white px-3 text-sm data-[placeholder]:text-black/25";

const categoryFields: Record<ItemCategory, FieldConfig[]> = {
  auto: [
    {
      key: "brand",
      label: "Бренд",
      type: "input",
      placeholder: "BMW",
    },
    {
      key: "model",
      label: "Модель",
      type: "input",
      placeholder: "X5",
    },
    {
      key: "yearOfManufacture",
      label: "Год выпуска",
      type: "input",
      placeholder: "2020",
    },
    {
      key: "transmission",
      label: "Коробка передач",
      type: "select",
      placeholder: "Выберите коробку",
      options: [
        { value: "automatic", label: "Автомат" },
        { value: "manual", label: "Механика" },
      ],
    },
    {
      key: "mileage",
      label: "Пробег",
      type: "input",
      placeholder: "45000",
    },
    {
      key: "enginePower",
      label: "Мощность двигателя",
      type: "input",
      placeholder: "249",
    },
  ],
  electronics: [
    {
      key: "type",
      label: "Тип",
      type: "select",
      placeholder: "Выберите тип",
      options: [
        { value: "phone", label: "Телефон" },
        { value: "laptop", label: "Ноутбук" },
        { value: "misc", label: "Другое" },
      ],
    },
    {
      key: "brand",
      label: "Бренд",
      type: "input",
      placeholder: "Apple",
    },
    {
      key: "model",
      label: "Модель",
      type: "input",
      placeholder: "MacBook Pro",
    },
    {
      key: "condition",
      label: "Состояние",
      type: "select",
      placeholder: "Выберите состояние",
      options: [
        { value: "new", label: "Новый" },
        { value: "used", label: "Б/у" },
      ],
    },
    {
      key: "color",
      label: "Цвет",
      type: "input",
      placeholder: "Серый",
    },
  ],
  real_estate: [
    {
      key: "type",
      label: "Тип",
      type: "select",
      placeholder: "Выберите тип",
      options: [
        { value: "flat", label: "Квартира" },
        { value: "house", label: "Дом" },
        { value: "room", label: "Комната" },
      ],
    },
    {
      key: "address",
      label: "Адрес",
      type: "input",
      placeholder: "Введите адрес",
    },
    {
      key: "area",
      label: "Площадь",
      type: "input",
      placeholder: "42",
    },
    { key: "floor", label: "Этаж", type: "input", placeholder: "7" },
  ],
};

const clearIcon = (
  <span className="flex size-3.5 items-center justify-center rounded-full bg-black/25">
    <X className="size-2 text-white" strokeWidth={3} />
  </span>
);

const formatPlaceholderValue = (value: string | number | undefined) =>
  value !== undefined && value !== null ? String(value) : undefined;

export const Form = ({ id }: FormProps) => {
  const { data } = useItemQuery(id, Number.isFinite(id) && id > 0);
  const [selectedCategory, setSelectedCategory] = useState<
    ItemCategory | undefined
  >();

  useEffect(() => {
    if (data?.category) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedCategory(data.category);
    }
  }, [data?.category]);

  const params = data?.params;

  return (
    <div className="flex flex-col gap-4.5">
      <div className="flex w-1/2 flex-col gap-2">
        <p className="text-base font-semibold opacity-85">Категория</p>
        <Select
          value={selectedCategory}
          onValueChange={(value) => setSelectedCategory(value as ItemCategory)}
        >
          <SelectTrigger className="h-8! w-60 border border-[#D9D9D9] text-sm">
            <SelectValue placeholder="Тип" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <hr />
      <div className="flex w-1/2 flex-col gap-2">
        <p className="before:text-red-500 before:text-sm flex items-center gap-2 text-base font-semibold opacity-85 before:content-['*']">
          Название
        </p>
        <Input
          placeholder={data?.title}
          className={baseInputClassName}
          endIcon={clearIcon}
          endIconClassName="h-[14px] w-[14px]"
          wrapperClassName={baseInputWrapperClassName}
        />
      </div>
      <hr />
      <div className="flex w-1/2 flex-col gap-2">
        <p className="before:text-red-500 before:text-sm flex items-center gap-2 text-base font-semibold opacity-85 before:content-['*']">
          Цена
        </p>
        <Input
          className={baseInputClassName}
          endIcon={clearIcon}
          endIconClassName="h-[14px] w-[14px]"
          placeholder={formatPlaceholderValue(data?.price)}
          wrapperClassName={baseInputWrapperClassName}
        />
      </div>
      <hr />
      <div className="flex w-1/2 flex-col gap-1">
        <p className="text-base font-semibold opacity-85">Характеристики</p>
        <div className="flex flex-col items-start gap-3">
          {selectedCategory ? (
            categoryFields[selectedCategory].map((field) => {
              const fieldValue = params?.[field.key as keyof typeof params] as
                | string
                | number
                | undefined;

              return (
                <div key={field.label} className="flex flex-col gap-2">
                  <p className="text-sm leading-5.5">{field.label}</p>
                  {field.type === "input" ? (
                    <Input
                      className={baseInputClassName}
                      endIcon={clearIcon}
                      endIconClassName="h-[14px] w-[14px]"
                      wrapperClassName={baseInputWrapperClassName}
                      placeholder={
                        formatPlaceholderValue(fieldValue) ?? field.placeholder
                      }
                    />
                  ) : (
                    <Select
                      value={
                        typeof fieldValue === "string" ? fieldValue : undefined
                      }
                    >
                      <SelectTrigger className={baseSelectTriggerClassName}>
                        <SelectValue placeholder={field.placeholder} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {field.options?.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                </div>
              );
            })
          ) : (
            <p className="text-sm text-black/45">
              Сначала выберите категорию, чтобы заполнить характеристики.
            </p>
          )}
        </div>
      </div>
      <hr />
      <div className="flex flex-col gap-2 w-2/3">
        <p className="text-base font-semibold opacity-85">Описание</p>
        <Textarea cols={2} className="bg-card" value={data?.description} />
      </div>
      <div className="flex gap-2.5">
        <Button className="text-[#F3F3F3] h-9.5 w-25.5 font-normal">
          Сохранить
        </Button>
        <Button className="bg-[#D9D9D9] text-[#5A5A5A] h-9.5 w-25.5 font-normal">
          Отменить
        </Button>
      </div>
    </div>
  );
};
