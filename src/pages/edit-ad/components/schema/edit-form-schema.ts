import { z } from "zod";

const optionalNumberField = () =>
  z
    .preprocess(
      (value) => (value === "" ? undefined : value),
      z.coerce.number().optional(),
    )
    .optional();

const optionalIntField = () =>
  z
    .preprocess(
      (value) => (value === "" ? undefined : value),
      z.coerce.number().int().optional(),
    )
    .optional();

const requiredNumberField = (message: string) =>
  z.preprocess(
    (value) => (value === "" ? undefined : value),
    z.number({ error: message }).min(0, message),
  );

const optionalTextField = () =>
  z.preprocess(
    (value) => (value === "" ? undefined : value),
    z.string().optional(),
  );

const autoParamsSchema = z.object({
  brand: z.string().optional(),
  model: z.string().optional(),
  yearOfManufacture: optionalIntField(),
  transmission: z.enum(["automatic", "manual"]).optional(),
  mileage: optionalIntField(),
  enginePower: optionalIntField(),
});

const realEstateParamsSchema = z.object({
  type: z.enum(["flat", "house", "room"]).optional(),
  address: z.string().optional(),
  area: optionalNumberField(),
  floor: optionalIntField(),
});

const electronicsParamsSchema = z.object({
  type: z.enum(["phone", "laptop", "misc"]).optional(),
  brand: z.string().optional(),
  model: z.string().optional(),
  condition: z.enum(["new", "used"]).optional(),
  color: z.string().optional(),
});

export const baseEditFormSchema = z.object({
  title: z.string().min(1, "Название должно быть заполнено"),
  description: optionalTextField(),
  price: requiredNumberField("Цена должна быть заполнена"),
});

export const editFormSchema = z.discriminatedUnion("category", [
  baseEditFormSchema.extend({
    category: z.literal("auto"),
    params: autoParamsSchema,
  }),
  baseEditFormSchema.extend({
    category: z.literal("real_estate"),
    params: realEstateParamsSchema,
  }),
  baseEditFormSchema.extend({
    category: z.literal("electronics"),
    params: electronicsParamsSchema,
  }),
]);

export type EditFormInput = z.input<typeof editFormSchema>;
export type EditFormOutput = z.output<typeof editFormSchema>;
