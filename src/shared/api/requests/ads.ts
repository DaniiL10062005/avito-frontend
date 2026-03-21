import { axiosDefault } from "../client";
import type {
  GetItemsQueryParams,
  ItemGetOut,
  ItemsGetOut,
  ItemUpdateIn,
} from "@/shared/types/ads";

export const getItemById = async (id: number): Promise<ItemGetOut> => {
  try {
    const response = await axiosDefault.get<ItemGetOut>(`/items/${id}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getItems = async (
  params?: GetItemsQueryParams,
): Promise<ItemsGetOut> => {
  try {
    const response = await axiosDefault.get<ItemsGetOut>("/items", {
      params: {
        ...params,
        categories: params?.categories?.join(","),
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const putItemsById = async (
  id: number,
  data: ItemUpdateIn,
): Promise<ItemGetOut> => {
  try {
    const response = await axiosDefault.put<ItemGetOut>(`/items/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
