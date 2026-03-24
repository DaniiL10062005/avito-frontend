import type {
  AutoItemParams,
  ElectronicsItemParams,
  RealEstateItemParams,
} from "./ads";

export type FieldConfig = {
  key: ParamKey;
  label: string;
  type: "input" | "select";
  placeholder?: string;
  options?: { value: string; label: string }[];
};

type ParamKey =
  | keyof AutoItemParams
  | keyof ElectronicsItemParams
  | keyof RealEstateItemParams;
