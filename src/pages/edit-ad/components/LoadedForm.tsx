import { useEffect, useState } from "react";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/components/Tooltip";
import { extractPriceFromAiResponse } from "@/shared/utils/extract-price-from-ai-response";
import { getNumericFieldValue } from "@/shared/utils/get-numeric-field-value";

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

type AiTooltipTarget = "price" | "description";


export const LoadedForm = ({ data }: LoadedFormProps) => {
  const initialValues = getFormValues(data);
  const { mutate, isPending } = useUpdateItemMutation();
  const navigate = useNavigate();
  const priceAiMutation = useGetAiAnswer();
  const descriptionAiMutation = useGetAiAnswer();
  const [activeTooltip, setActiveTooltip] = useState<AiTooltipTarget | null>(
    null,
  );
  const [tooltipText, setTooltipText] = useState("");

  const { control, handleSubmit, reset, setValue } = useForm<
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

  const showTooltip = (target: AiTooltipTarget, text: string) => {
    setTooltipText(text);
    setActiveTooltip(target);
  };

  const closeTooltip = () => {
    setActiveTooltip(null);
    setTooltipText("");
  };

  const applyTooltipValue = () => {
    if (!activeTooltip || !tooltipText.trim()) {
      return;
    }

    if (activeTooltip === "description") {
      setValue("description", tooltipText, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
      closeTooltip();
      return;
    }

    const extractedPrice = extractPriceFromAiResponse(tooltipText);

    if (extractedPrice === null) {
      toast("Не удалось распознать цену из ответа AI", {
        icon: <CircleX className="size-5 text-red-500" />,
        unstyled: true,
        className:
          "bg-[#FFF1F0] border border-[#FFCCC7] rounded-xs px-4 py-2 flex items-center gap-[10px]",
      });
      return;
    }

    setValue("price", extractedPrice, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
    closeTooltip();
  };

  const getAnswer = (
    task: AiTask,
    aiMutation: ReturnType<typeof useGetAiAnswer>,
    tooltipTarget: AiTooltipTarget,
  ) => {
    if (!selectedCategory) {
      return;
    }

    aiMutation.mutate(
      {
        task,
        ad: {
          category: selectedCategory,
          title: title ?? "",
          description:
            typeof description === "string" ? description : undefined,
          price: typeof price === "number" ? price : undefined,
          params,
        },
      },
      {
        onSuccess: (response) => {
          if (response.response.trim()) {
            showTooltip(tooltipTarget, response.response.trim());
          }
        },
      },
    );
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
      <div className="flex w-2/3 flex-col gap-4.5">
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
        <div className="min-w-1/2 flex items-end gap-6">
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

          <TooltipProvider>
            <Tooltip
              open={activeTooltip === "price"}
              onOpenChange={(open) => {
                if (!open && activeTooltip === "price") {
                  closeTooltip();
                }
              }}
            >
              <TooltipTrigger asChild>
                <span>
                  <AIButton
                    onClick={() =>
                      getAnswer(
                        "estimate_market_price",
                        priceAiMutation,
                        "price",
                      )
                    }
                    state={priceButtonState}
                    text="Узнать рыночную цену"
                    icon={<Lightbulb className="size-4 text-[#FFA940]" />}
                  />
                </span>
              </TooltipTrigger>
              <TooltipContent
                side="top"
                sideOffset={8}
                className="max-w-90 rounded-xl border border-black/10 bg-white p-3 text-black shadow-[0_16px_40px_rgba(0,0,0,0.14)]"
                arrowClassName="bg-white fill-white"
              >
                <div className="flex flex-col gap-3">
                  <p className="whitespace-pre-wrap text-sm leading-5">
                    {tooltipText}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      onClick={applyTooltipValue}
                      className="h-6 rounded-md px-2 text-sm font-normal text-white "
                    >
                      Применить
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={closeTooltip}
                      className="h-6 rounded-md border-[#D9D9D9] font-normal bg-white px-2 text-sm  text-black/85 "
                    >
                      Закрыть
                    </Button>
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
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
        <div className="flex w-full flex-col items-start gap-2">
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
          <TooltipProvider>
            <Tooltip
              open={activeTooltip === "description"}
              onOpenChange={(open) => {
                if (!open && activeTooltip === "description") {
                  closeTooltip();
                }
              }}
            >
              <TooltipTrigger asChild>
                <span>
                  <AIButton
                    onClick={() =>
                      getAnswer(
                        "generate_description",
                        descriptionAiMutation,
                        "description",
                      )
                    }
                    state={descriptionButtonState}
                    text={descriptionButtonText}
                    icon={<Lightbulb className="size-4 text-[#FFA940]" />}
                  />
                </span>
              </TooltipTrigger>
              <TooltipContent
                side="top"
                sideOffset={8}
                className="max-w-90 rounded-xl border border-black/10 bg-white p-3 text-black shadow-[0_16px_40px_rgba(0,0,0,0.14)]"
                arrowClassName="bg-white fill-white"
              >
                <div className="flex flex-col gap-3">
                  <p className="whitespace-pre-wrap text-sm leading-5">
                    {tooltipText}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      onClick={applyTooltipValue}
                      className="h-6 rounded-md  px-2 text-sm text-white font-normal"
                    >
                      Применить
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={closeTooltip}
                      className="h-6 rounded-md border-[#D9D9D9] font-normal bg-white px-2 text-sm text-black/85 "
                    >
                      Закрыть
                    </Button>
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="flex gap-2.5">
          <Button
            type="submit"
            disabled={isPending}
            className="h-9.5 w-25.5 font-normal text-[#F3F3F3]"
          >
            Сохранить
          </Button>
          <Button
            type="button"
            disabled={isPending}
            onClick={() => reset(initialValues)}
            className="h-9.5 w-25.5 bg-[#D9D9D9] font-normal text-[#5A5A5A]"
          >
            Отменить
          </Button>
        </div>
      </div>
    </form>
  );
};
