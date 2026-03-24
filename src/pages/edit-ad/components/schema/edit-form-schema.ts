import { z } from "zod";

const autoParamsSchema = z.object({
  brand: z.string().optional(),
  model: z.string().optional(),
  yearOfManufacture: z.coerce.number().int().optional(),
  transmission: z.enum(["automatic", "manual"]).optional(),
  mileage: z.coerce.number().int().optional(),
  enginePower: z.coerce.number().int().optional(),
});

const realEstateParamsSchema = z.object({
  type: z.enum(["flat", "house", "room"]).optional(),
  address: z.string().optional(),
  area: z.coerce.number().optional(),
  floor: z.coerce.number().int().optional(),
});

const electronicsParamsSchema = z.object({
  type: z.enum(["phone", "laptop", "misc"]).optional(),
  brand: z.string().optional(),
  model: z.string().optional(),
  condition: z.enum(["new", "used"]).optional(),
  color: z.string().optional(),
});

export const baseEditFormSchema = z.object({
  title: z.string().min(1, "Введите заголовок объявления"),
  description: z.string().min(1, "Введите описание объявления"),
  price: z.number().min(0, "Введите цену"),
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
