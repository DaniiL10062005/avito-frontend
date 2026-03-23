import { useItemQuery } from "@/shared/api/queries/ads";
import { Spinner } from "@/shared/components/Spinner";
import { useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import { Header } from "./Header";
import { ParamsOfAd } from "./ParamsOfAd";

export const Ad = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const itemId = Number(id);
  const isValidId = Number.isFinite(itemId);

  const { data, isError, isPending } = useItemQuery(
    Number(location.pathname.split("/").filter((item) => item !== "")[1]),
  );

  useEffect(() => {
    if (isError || !isValidId) {
      navigate("/ads");
    }
  }, [isError, isValidId, navigate]);

  return isPending ? (
    <div className="h-screen w-screen flex items-center justify-center">
      <Spinner className="size-14" />
    </div>
  ) : (
    <div className="min-h-screen flex flex-col gap-8 items-start p-8 w-full">
      <Header {...data} />
      <hr className="w-full bg-[#F0F0F0] h-px" />
      <ParamsOfAd {...data} />
    </div>
  );
};
