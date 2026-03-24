import { useEffect } from "react";
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
import { Input, inputErrorClassName } from "@/shared/components/Input";
import { CATEGORY_FIELDS } from "@/shared/constants/category-fields";
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
import { useUpdateItemMutation } from "@/shared/api/queries/ads";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { CheckCircle2, CircleX, Lightbulb } from "lucide-react";
import { formatFieldValue } from "@/shared/utils/format-field-values";
import { AIButton } from "./AIButton";
import { useGetAiAnswer } from "@/shared/api/queries/ai";
import type { AiTask } from "@/shared/types/ai";

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

const getDigitsOnlyValue = (value: string) => value.replace(/\D+/g, "");

const getNumericFieldValue = (value: string) => {
  const digitsOnlyValue = getDigitsOnlyValue(value);

  return digitsOnlyValue === "" ? "" : Number(digitsOnlyValue);
};

export const LoadedForm = ({ data }: LoadedFormProps) => {
  const initialValues = getFormValues(data);
  const { mutate, isPending } = useUpdateItemMutation();
  const navigate = useNavigate();
  const priceAiMutation = useGetAiAnswer();
  const descriptionAiMutation = useGetAiAnswer();

  const { control, handleSubmit, reset } = useForm<
    EditFormInput,
    unknown,
    EditFormOutput
  >({
    resolver: zodResolver(editFormSchema),
    defaultValues: initialValues,
  });

  useEffect(() => {
    reset(initialValues);
  }, [initialValues, reset]);

  const selectedCategory = useWatch({ control, name: "category" });
  const title = useWatch({ control, name: "title" });
  const description = useWatch({ control, name: "description" });
  const price = useWatch({ control, name: "price" });
  const params = useWatch({ control, name: "params" });

  const onSubmit = (values: EditFormOutput) => {
    mutate(
      {
        id: data.id,
        data: values,
      },
      {
        onSuccess: () => {
          toast("Изменения сохранены", {
            icon: <CheckCircle2 className="size-5 fill-green-500 text-white" />,
            unstyled: true,
            className:
              "bg-[#F6FFED] border border-[#B7EB8F] rounded-xs px-4 py-2 flex items-center gap-[10px]",
          });
          navigate("/ads");
        },
        onError: () => {
          toast("Ошибка сохранения", {
            icon: <CircleX className="size-5 text-red-500" />,
            description:
              "При попытке сохранить изменения произошла ошибка. Попробуйте ещё раз или зайдите позже.",
            unstyled: true,
            className:
              "bg-[#FFF1F0] border border-[#FFCCC7] rounded-xs px-4 py-3",
            classNames: {
              toast: "flex items-start gap-[10px]",
              content: "flex flex-col gap-1",
              title: "text-[16px] leading-6 font-medium text-black/85",
              description: "text-sm leading-5 text-black! m-0",
              icon: "shrink-0 mt-0.5",
            },
          });
        },
      },
    );
  };

  const getAnswer = (
    task: AiTask,
    getAiAnswer: ReturnType<typeof useGetAiAnswer>["mutate"],
  ) => {
    if (!selectedCategory) {
      return;
    }

    getAiAnswer({
      task,
      ad: {
        category: selectedCategory,
        title: title ?? "",
        description: typeof description === "string" ? description : undefined,
        price: typeof price === "number" ? price : undefined,
        params,
      },
    });
  };

  const priceButtonState = priceAiMutation.isPending
    ? "loading"
    : priceAiMutation.isSuccess || priceAiMutation.isError
      ? "retry"
      : "initial";
  const descriptionButtonState = descriptionAiMutation.isPending
    ? "loading"
    : descriptionAiMutation.isSuccess || descriptionAiMutation.isError
      ? "retry"
      : "initial";
  const descriptionButtonText =
    typeof description === "string" && description.trim() !== ""
      ? "Улучшить описание"
      : "Придумать описание";

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-4.5 w-2/3">
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
            render={({ field, fieldState }) => (
              <>
                <Input
                  {...field}
                  value={field.value ?? ""}
                  onClear={() => field.onChange("")}
                  aria-invalid={fieldState.invalid}
                  variant="editAd"
                  clearable
                  wrapperClassName={
                    fieldState.error ? inputErrorClassName : undefined
                  }
                  endIcon={ClearIcon}
                  endIconClassName="h-[14px] w-[14px]"
                />
                {fieldState.error?.message ? (
                  <p className="text-sm text-[#FF4D4F]">
                    {fieldState.error.message}
                  </p>
                ) : null}
              </>
            )}
          />
        </div>
        <hr />
        <div className="min-w-1/2 flex gap-6 items-end">
          <div className="flex flex-col gap-2">
            <p className="before:text-red-500 before:text-sm flex items-center gap-2 text-base font-semibold opacity-85 before:content-['*']">
              Цена
            </p>
            <Controller
              control={control}
              name="price"
              render={({ field, fieldState }) => (
                <>
                  <Input
                    value={formatFieldValue(field.value)}
                    onClear={() => field.onChange("")}
                    onChange={(event) =>
                      field.onChange(getNumericFieldValue(event.target.value))
                    }
                    inputMode="numeric"
                    pattern="[0-9]*"
                    aria-invalid={fieldState.invalid}
                    variant="editAd"
                    clearable
                    wrapperClassName={
                      fieldState.error ? inputErrorClassName : undefined
                    }
                    endIcon={ClearIcon}
                    endIconClassName="h-[14px] w-[14px]"
                  />
                  {fieldState.error?.message ? (
                    <p className="text-sm text-[#FF4D4F]">
                      {fieldState.error.message}
                    </p>
                  ) : null}
                </>
              )}
            />
          </div>
          <AIButton
            onClick={() =>
              getAnswer("estimate_market_price", priceAiMutation.mutate)
            }
            state={priceButtonState}
            text="Узнать рыночную цену"
            icon={<Lightbulb className="text-[#FFA940] size-4" />}
          />
        </div>

        <hr />
        <div className="flex w-1/2 flex-col gap-1">
          <p className="text-base font-semibold opacity-85">Характеристики</p>
          <div className="flex flex-col items-start gap-3">
            {selectedCategory ? (
              CATEGORY_FIELDS[selectedCategory].map((configField) => {
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
                        render={({ field, fieldState }) => (
                          <>
                            <Input
                              value={formatFieldValue(field.value)}
                              onClear={() => field.onChange("")}
                              onChange={(event) =>
                                field.onChange(
                                  isNumericField
                                    ? getNumericFieldValue(event.target.value)
                                    : event.target.value,
                                )
                              }
                              inputMode={isNumericField ? "numeric" : undefined}
                              pattern={isNumericField ? "[0-9]*" : undefined}
                              aria-invalid={fieldState.invalid}
                              variant="editAd"
                              clearable
                              wrapperClassName={
                                fieldState.error
                                  ? inputErrorClassName
                                  : fieldValue === undefined ||
                                      fieldValue === ""
                                    ? "!border-[#FFA940]"
                                    : ""
                              }
                              endIcon={ClearIcon}
                              endIconClassName="h-[14px] w-[14px]"
                              placeholder={configField.placeholder}
                            />
                            {fieldState.error?.message ? (
                              <p className="text-sm text-[#FF4D4F]">
                                {fieldState.error.message}
                              </p>
                            ) : null}
                          </>
                        )}
                      />
                    ) : (
                      <Controller
                        control={control}
                        name={fieldName}
                        render={({ field, fieldState }) => (
                          <>
                            <Select
                              value={
                                typeof field.value === "string"
                                  ? field.value
                                  : undefined
                              }
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger
                                aria-invalid={fieldState.invalid}
                                className={
                                  fieldState.error
                                    ? "border-[#FF4D4F]! shadow-[0px_0px_0px_2px_rgba(255,77,79,0.2)]"
                                    : fieldValue === undefined ||
                                        fieldValue === ""
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
                            {fieldState.error?.message ? (
                              <p className="text-sm text-[#FF4D4F]">
                                {fieldState.error.message}
                              </p>
                            ) : null}
                          </>
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
        <div className="flex w-full flex-col gap-2 items-start">
          <p className="text-base font-semibold opacity-85">Описание</p>
          <Controller
            control={control}
            name="description"
            render={({ field, fieldState }) => (
              <>
                <Textarea
                  {...field}
                  cols={2}
                  aria-invalid={fieldState.invalid}
                  className="bg-card"
                  value={typeof field.value === "string" ? field.value : ""}
                />
                {fieldState.error?.message ? (
                  <p className="text-sm text-[#FF4D4F]">
                    {fieldState.error.message}
                  </p>
                ) : null}
              </>
            )}
          />
          <AIButton
            onClick={() =>
              getAnswer("generate_description", descriptionAiMutation.mutate)
            }
            state={descriptionButtonState}
            text={descriptionButtonText}
            icon={<Lightbulb className="text-[#FFA940] size-4" />}
          />
        </div>
        <div className="flex gap-2.5">
          <Button
            type="submit"
            disabled={isPending}
            className="h-9.5 w-25.5 text-[#F3F3F3] font-normal"
          >
            Сохранить
          </Button>
          <Button
            type="button"
            disabled={isPending}
            onClick={() => reset(initialValues)}
            className="h-9.5 w-25.5 bg-[#D9D9D9] text-[#5A5A5A] font-normal"
          >
            Отменить
          </Button>
        </div>
      </div>
    </form>
  );
};

