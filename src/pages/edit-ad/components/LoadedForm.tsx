import { Button } from "@/shared/components/Button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/Select";
import { Textarea } from "@/shared/components/Textarea";
import { Controller, useForm, useWatch, type FieldPath } from "react-hook-form";
import { ClearIcon } from "./ClearIcon";
import { Input } from "@/shared/components/Input";
import { categoryFields } from "@/shared/constants/category-fields";
import {
  editFormSchema,
  type EditFormInput,
  type EditFormOutput,
} from "./schema/edit-form-schema";
import type {
  AutoItemParams,
  ElectronicsItemParams,
  Item,
  ItemCategory,
  RealEstateItemParams,
} from "@/shared/types/ads";
import { CATEGORY_LABELS } from "@/shared/constants/category-labels";
import { zodResolver } from "@hookform/resolvers/zod";

const getFormValues = (data: Item): EditFormInput => {
  switch (data.category) {
    case "auto":
      return {
        category: "auto",
        title: data.title,
        description: data.description ?? "",
        price: data.price,
        params: data.params as AutoItemParams,
      };
    case "real_estate":
      return {
        category: "real_estate",
        title: data.title,
        description: data.description ?? "",
        price: data.price,
        params: data.params as RealEstateItemParams,
      };
    case "electronics":
      return {
        category: "electronics",
        title: data.title,
        description: data.description ?? "",
        price: data.price,
        params: data.params as ElectronicsItemParams,
      };
  }
};

const numericParamKeys = new Set([
  "yearOfManufacture",
  "mileage",
  "enginePower",
  "area",
  "floor",
]);
interface LoadedFormProps {
  data: Item;
}

const formatFieldValue = (value: string | number | undefined) =>
  typeof value === "number" ? String(value) : (value ?? "");

export const LoadedForm = ({ data }: LoadedFormProps) => {
  const { control, handleSubmit } = useForm<
    EditFormInput,
    unknown,
    EditFormOutput
  >({
    resolver: zodResolver(editFormSchema),
    defaultValues: getFormValues(data),
  });

  const selectedCategory = useWatch({ control, name: "category" });
  const params = useWatch({ control, name: "params" });

  const onSubmit = (values: EditFormOutput) => {
    console.log(values);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-4.5">
        <div className="flex w-1/2 flex-col gap-2">
          <p className="text-base font-semibold opacity-85">Категория</p>
          <Controller
            control={control}
            name="category"
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={(value) => field.onChange(value as ItemCategory)}
              >
                <SelectTrigger className="h-8! w-60 border border-[#D9D9D9] text-sm">
                  <SelectValue placeholder="Тип" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
        </div>
        <hr />
        <div className="flex w-1/2 flex-col gap-2">
          <p className="before:text-red-500 before:text-sm flex items-center gap-2 text-base font-semibold opacity-85 before:content-['*']">
            Название
          </p>
          <Controller
            control={control}
            name="title"
            render={({ field }) => (
              <Input
                {...field}
                value={field.value ?? ""}
                variant="editAd"
                clearable
                endIcon={ClearIcon}
                endIconClassName="h-[14px] w-[14px]"
              />
            )}
          />
        </div>
        <hr />
        <div className="flex w-1/2 flex-col gap-2">
          <p className="before:text-red-500 before:text-sm flex items-center gap-2 text-base font-semibold opacity-85 before:content-['*']">
            Цена
          </p>
          <Controller
            control={control}
            name="price"
            render={({ field }) => (
              <Input
                value={formatFieldValue(field.value)}
                onChange={(event) =>
                  field.onChange(
                    event.target.value === ""
                      ? undefined
                      : Number(event.target.value),
                  )
                }
                variant="editAd"
                clearable
                endIcon={ClearIcon}
                endIconClassName="h-[14px] w-[14px]"
              />
            )}
          />
        </div>
        <hr />
        <div className="flex w-1/2 flex-col gap-1">
          <p className="text-base font-semibold opacity-85">Характеристики</p>
          <div className="flex flex-col items-start gap-3">
            {selectedCategory ? (
              categoryFields[selectedCategory].map((configField) => {
                const fieldName =
                  `params.${configField.key}` as FieldPath<EditFormInput>;
                const fieldValue = params?.[
                  configField.key as keyof typeof params
                ] as string | number | undefined;
                const isNumericField = numericParamKeys.has(configField.key);

                return (
                  <div key={configField.label} className="flex flex-col gap-2">
                    <p className="text-sm leading-5.5">{configField.label}</p>
                    {configField.type === "input" ? (
                      <Controller
                        control={control}
                        name={fieldName}
                        render={({ field }) => (
                          <Input
                            value={formatFieldValue(field.value)}
                            onChange={(event) =>
                              field.onChange(
                                isNumericField
                                  ? event.target.value === ""
                                    ? undefined
                                    : Number(event.target.value)
                                  : event.target.value,
                              )
                            }
                            variant="editAd"
                            clearable
                            wrapperClassName={
                              fieldValue === undefined
                                ? "!border-[#FFA940]"
                                : ""
                            }
                            endIcon={ClearIcon}
                            endIconClassName="h-[14px] w-[14px]"
                            placeholder={configField.placeholder}
                          />
                        )}
                      />
                    ) : (
                      <Controller
                        control={control}
                        name={fieldName}
                        render={({ field }) => (
                          <Select
                            value={
                              typeof field.value === "string"
                                ? field.value
                                : undefined
                            }
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger
                              className={
                                fieldValue === undefined
                                  ? "border-[#FFA940]!"
                                  : ""
                              }
                              variant="editAd"
                            >
                              <SelectValue
                                placeholder={configField.placeholder}
                              />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                {configField.options?.map((option) => (
                                  <SelectItem
                                    key={option.value}
                                    value={option.value}
                                  >
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        )}
                      />
                    )}
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-black/45">
                Сначала выберите категорию, чтобы заполнить характеристики.
              </p>
            )}
          </div>
        </div>
        <hr />
        <div className="flex w-2/3 flex-col gap-2">
          <p className="text-base font-semibold opacity-85">Описание</p>
          <Controller
            control={control}
            name="description"
            render={({ field }) => (
              <Textarea
                {...field}
                cols={2}
                className="bg-card"
                value={field.value ?? ""}
              />
            )}
          />
        </div>
        <div className="flex gap-2.5">
          <Button
            type="submit"
            className="h-9.5 w-25.5 text-[#F3F3F3] font-normal"
          >
            Сохранить
          </Button>
          <Button className="h-9.5 w-25.5 bg-[#D9D9D9] text-[#5A5A5A] font-normal">
            Отменить
          </Button>
        </div>
      </div>
    </form>
  );
};
