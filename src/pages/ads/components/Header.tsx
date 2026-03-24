import { useAdsQuery } from "@/shared/api/queries/ads";

export const Header = () => {
  const { data } = useAdsQuery();
  return (
    <div className="flex flex-col mx-2 my-3">
      <p className="text-2xl font-medium">Мои объявления</p>
      <p className="text-lg text-[#848388]">{data?.total} объявления</p>
    </div>
  );
};
