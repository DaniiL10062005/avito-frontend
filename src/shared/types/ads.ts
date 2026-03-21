export type ItemCategory = "auto" | "real_estate" | "electronics";

export type ItemUpdateIn = {
  category: ItemCategory;
  title: string;
  description?: string;
  price: number;
  params: AutoItemParams | RealEstateItemParams | ElectronicsItemParams;
};

export type AutoItemParams = {
  brand?: string;
  model?: string;
  yearOfManufacture?: number;
  transmission?: "automatic" | "manual";
  mileage?: number;
  enginePower?: number;
};

export type RealEstateItemParams = {
  type?: "flat" | "house" | "room";
  address?: string;
  area?: number;
  floor?: number;
};

export type ElectronicsItemParams = {
  type?: "phone" | "laptop" | "misc";
  brand?: string;
  model?: string;
  condition?: "new" | "used";
  color?: string;
};

export type Item = {
  id: number;
  category: ItemCategory;
  title: string;
  description?: string;
  price: number;
  createdAt?: string;
  params: AutoItemParams | RealEstateItemParams | ElectronicsItemParams;
};

export type ItemsGetOut = {
  items: {
    category: ItemCategory;
    title: string;
    price: number;
    needsRevision: boolean;
  }[];
  total: number;
};

export type ItemGetOut = {
  items: (Item & {
    needsRevision: boolean;
  })[];
  total: number;
};

export type GetItemsQueryParams = {
  q?: string;
  limit?: number;
  skip?: number;
  needsRevision?: true;
  categories?: ItemCategory[];
  sortColumn?: "title" | "createdAt";
  sortDirection?: "asc" | "desc";
};
