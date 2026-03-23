import type {
  AutoItemParams,
  ElectronicsItemParams,
  Item,
  RealEstateItemParams,
} from "@/shared/types/ads";

const hasValue = (value: unknown) => {
  if (typeof value === "string") {
    return value.trim().length > 0;
  }

  return value !== undefined && value !== null;
};

const hasCompleteAutoParams = (params: AutoItemParams) =>
  hasValue(params.brand) &&
  hasValue(params.model) &&
  hasValue(params.yearOfManufacture) &&
  hasValue(params.transmission) &&
  hasValue(params.mileage) &&
  hasValue(params.enginePower);

const hasCompleteRealEstateParams = (params: RealEstateItemParams) =>
  hasValue(params.type) &&
  hasValue(params.address) &&
  hasValue(params.area) &&
  hasValue(params.floor);

const hasCompleteElectronicsParams = (params: ElectronicsItemParams) =>
  hasValue(params.type) &&
  hasValue(params.brand) &&
  hasValue(params.model) &&
  hasValue(params.condition) &&
  hasValue(params.color);

export const getNeedsRevision = (item: Item) => {
  const hasBaseFields = hasValue(item.title);

  if (!hasBaseFields) {
    return true;
  }

  switch (item.category) {
    case "auto":
      return !hasCompleteAutoParams(item.params as AutoItemParams);
    case "real_estate":
      return !hasCompleteRealEstateParams(item.params as RealEstateItemParams);
    case "electronics":
      return !hasCompleteElectronicsParams(
        item.params as ElectronicsItemParams,
      );
    default:
      return false;
  }
};
