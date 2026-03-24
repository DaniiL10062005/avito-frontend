import { useEffect } from "react";
import { useNavigate } from "react-router";

import { useItemQuery } from "@/shared/api/queries/ads";
import { Spinner } from "@/shared/components/Spinner";
import { LoadedForm } from "./LoadedForm";

interface FormProps {
  id: number;
}

export const Form = ({ id }: FormProps) => {
  const { data, isPending, isError } = useItemQuery(
    id,
    Number.isFinite(id) && id > 0,
  );
  const navigate = useNavigate();

  useEffect(() => {
    if (isError) {
      navigate("/ads");
    }
  }, [isError, navigate]);

  if (isPending || !data) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <Spinner className="size-14" />
      </div>
    );
  }

  return <LoadedForm data={data} />;
};
