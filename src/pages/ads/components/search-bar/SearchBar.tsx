import { Search } from "lucide-react";

import { Card } from "@/shared/components/Card";
import { Input } from "@/shared/components/Input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/Select";
import { SelectFormat } from "./SelectFormat";

export const Searchbar = () => {
  return (
    <Card className="flex flex-row items-center gap-6">
      <Input
        placeholder="Найти объявление...."
        endIcon={<Search className="size-3" />}
      />
      <div className="flex gap-4 items-center">
        <SelectFormat />
        <div className="flex h-8 items-center rounded-lg bg-muted p-1">
          <Select>
            <SelectTrigger className="w-60 h-6! text-sm">
              <SelectValue
                defaultValue={1}
                placeholder="По новизне (сначала новые)"
              />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="1">По новизне (сначала новые)</SelectItem>
                <SelectItem value="2">По цене (сначала дешевые)</SelectItem>
                <SelectItem value="3">По цене (сначала дорогие)</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
    </Card>
  );
};
