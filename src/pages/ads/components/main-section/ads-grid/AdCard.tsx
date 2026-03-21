import { Card } from "@/shared/components/Card";

export interface AdCardProps {
  imageSrc?: string;
  category?: string;
  name: string;
  price: number;
  improvementNeeded?: boolean;
}

export const AdCard = ({
  imageSrc = "placeholder.png",
  category,
  name,
  price,
  improvementNeeded,
}: AdCardProps) => {
  return (
    <Card className="flex flex-col gap-0 w-50 p-0 ">
      <img
        className=" aspect-4/3 w-50 object-contain"
        src={imageSrc}
        alt="Placeholder"
      />
      <div className="flex flex-col items-start gap-1 px-4 pb-4 relative">
        <span className="border border-[#D9D9D9] px-3 rounded-md absolute -top-2.5">
          {category || "Категория"}
        </span>
        <p className="text-base font-normal leading-6 mt-5">{name}</p>
        <p className="text-lg font-semibold opacity-45">
          {price}
          {" ₽"}
        </p>
        {improvementNeeded && (
          <span className="bg-[#F9F1E6] flex items-center gap-2 text-[#FAAD14] text-sm font-normal px-2 rounded-lg py-px leading-6">
            <div className="bg-[#FAAD14] rounded-full w-1.5 h-1.5"></div>
            Требует доработок
          </span>
        )}
      </div>
    </Card>
  );
};
