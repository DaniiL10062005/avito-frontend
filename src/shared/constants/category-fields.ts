import type { ItemCategory } from "../types/ads";
import type { FieldConfig } from "../types/form-fields";

export const categoryFields: Record<ItemCategory, FieldConfig[]> = {
  auto: [
    {
      key: "brand",
      label: "Бренд",
      type: "input",
      placeholder: "Введите бренд",
    },
    {
      key: "model",
      label: "Модель",
      type: "input",
      placeholder: "Введите модель",
    },
    {
      key: "yearOfManufacture",
      label: "Год выпуска",
      type: "input",
      placeholder: "Введите год выпуска",
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
      placeholder: "Введите пробег",
    },
    {
      key: "enginePower",
      label: "Мощность двигателя",
      type: "input",
      placeholder: "Введите мощность",
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
      placeholder: "Введите бренд",
    },
    {
      key: "model",
      label: "Модель",
      type: "input",
      placeholder: "Введите модель",
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
      placeholder: "Введите цвет",
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
      placeholder: "Введите площадь",
    },
    { key: "floor", label: "Этаж", type: "input", placeholder: "Введите этаж" },
  ],
};
