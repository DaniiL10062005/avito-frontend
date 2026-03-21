import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import type { AdsViewMode } from "@/pages/ads/store/useAdsViewModeStore";
import { getItemById, getItems, putItemsById } from "@/shared/api/requests/ads";
import type {
  GetItemsQueryParams,
  UpdateItemMutationParams,
  UseAdsQueryParams,
  UseInfiniteAdsQueryParams,
} from "@/shared/types/ads";

export const adsQueryKeys = {
  all: ["ads"] as const,
  list: (params?: GetItemsQueryParams) =>
    [...adsQueryKeys.all, "list", params ?? {}] as const,
  infiniteList: (viewMode: AdsViewMode, batchSize: number) =>
    [...adsQueryKeys.all, "infinite", viewMode, batchSize] as const,
  detail: (id: number) => [...adsQueryKeys.all, "detail", id] as const,
};

export const useAdsQuery = ({ params, enabled }: UseAdsQueryParams = {}) =>
  useQuery({
    queryKey: adsQueryKeys.list(params),
    queryFn: () => getItems(params),
    enabled,
  });

export const useInfiniteAdsQuery = ({
  batchSize,
  viewMode,
  enabled,
}: UseInfiniteAdsQueryParams) =>
  useInfiniteQuery({
    queryKey: adsQueryKeys.infiniteList(viewMode, batchSize),
    initialPageParam: 0,
    queryFn: ({ pageParam }) =>
      getItems({
        limit: batchSize,
        skip: pageParam,
      }),
    getNextPageParam: (lastPage, allPages) => {
      const loadedItemsCount = allPages.reduce(
        (total, page) => total + page.items.length,
        0,
      );

      return loadedItemsCount < lastPage.total ? loadedItemsCount : undefined;
    },
    enabled,
  });

export const useItemQuery = (id: number, enabled = true) =>
  useQuery({
    queryKey: adsQueryKeys.detail(id),
    queryFn: () => getItemById(id),
    enabled,
  });

export const useUpdateItemMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: UpdateItemMutationParams) =>
      putItemsById(id, data),
    onSuccess: (_response, { id }) => {
      void queryClient.invalidateQueries({
        queryKey: adsQueryKeys.all,
      });
      void queryClient.invalidateQueries({
        queryKey: adsQueryKeys.detail(id),
      });
    },
  });
};
