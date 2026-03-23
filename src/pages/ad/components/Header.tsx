import { Button } from "@/shared/components/Button";
import { formatDate } from "@/shared/utils/formate-date";
import { PencilLine } from "lucide-react";
import { useNavigate } from "react-router";

interface HeaderProps {
  title?: string;
  price?: number;
  createdAt?: string;
  updatedAt?: string;
  id: number;
}

export const Header = (props: HeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="flex items-center justify-between leading-10 text-3xl font-medium">
        <p>{props.title}</p>
        <p>
          {props.price}
          {" ₽"}
        </p>
      </div>
      <div className="flex items-center justify-between">
        <Button
          onClick={() => navigate(`/ads/${props.id}/edit`)}
          className="h-10 text-base font-light cursor-pointer"
        >
          Редактировать <PencilLine size={18} />
        </Button>
        <div className="flex flex-col gap-1 text-right text-[#848388] text-base font-normal">
          <span>
            Опубликовано:{props.createdAt ? formatDate(props.createdAt) : ""}
          </span>
          <span>
            Отредактировано:
            {props.updatedAt ? formatDate(props.updatedAt) : ""}
          </span>
        </div>
      </div>
    </div>
  );
};
