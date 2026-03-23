import { Button } from "@/shared/components/Button";
import { formatDate } from "@/shared/utils/formate-date";
import { PencilLine } from "lucide-react";

interface HeaderProps {
  title?: string;
  price?: number;
  createdAt?: string;
  updatedAt?: string;
}

export const Header = (props: HeaderProps) => {
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
        <Button className="h-10 text-base font-light">
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
