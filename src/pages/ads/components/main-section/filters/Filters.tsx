import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/shared/components/Accordion";
import { Button } from "@/shared/components/Button";
import { Card } from "@/shared/components/Card";
import { Checkbox } from "@/shared/components/Checkbox";
import { Switch } from "@/shared/components/Switch";

const categoryOptions = [
  { id: "auto", label: "Авто" },
  { id: "electronics", label: "Электроника" },
  { id: "real-estate", label: "Недвижимость" },
];

export const Filters = () => {
  return (
    <div className="flex flex-col gap-2.5">
      <Card className="flex flex-col gap-2.5 w-[256px] p-4">
        <p className="text-base font-medium">Фильтры</p>
        <Accordion type="single" collapsible defaultValue="category">
          <AccordionItem value="category" className="border-none">
            <AccordionTrigger className="text-sm font-normal hover:no-underline">
              Категория
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col gap-5">
                {categoryOptions.map((option) => (
                  <label
                    key={option.id}
                    htmlFor={option.id}
                    className="flex cursor-pointer items-center gap-3 text-sm font-normal leading-none"
                  >
                    <Checkbox id={option.id} />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <hr />
        <div className="flex items-center justify-between">
          <p className="font-medium text-sm">Только требующие доработок</p>
          <Switch />
        </div>
      </Card>
      <Button variant="primary" className="w-full h-10.25 font-normal">
        Сбросить фильтры
      </Button>
    </div>
  );
};
