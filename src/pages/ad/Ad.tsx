import { useItemQuery } from "@/shared/api/queries/ads";
import { Spinner } from "@/shared/components/Spinner";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { Header } from "./components/Header";
import { ParamsOfAd } from "./components/ParamsOfAd";
import { AdDescription } from "./components/AdDescription";

export const Ad = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const itemId = Number(id);
  const isValidId = Number.isInteger(itemId) && itemId > 0;

  const { data, isError, isPending } = useItemQuery(itemId, isValidId);

  useEffect(() => {
    if (isError || !isValidId) {
      navigate("/ads");
    }
  }, [isError, isValidId, navigate]);

  return isPending || !data ? (
    <div className="h-screen w-screen flex items-center justify-center">
      <Spinner className="size-14" />
    </div>
  ) : (
    <div className="min-h-screen flex flex-col gap-8 items-start p-8 w-full">
      <Header {...data} />
      <hr className="w-full bg-[#F0F0F0] h-px" />
      <ParamsOfAd {...data} />
      <AdDescription description={data?.description} />
    </div>
  );
};
