import type { GetAiAnswerParams } from "../types/ai";

export const buildAiUserPrompt = ({ task, ad }: GetAiAnswerParams): string => {
  const baseInfo = [
    `Категория: ${ad.category}`,
    `Название: ${ad.title}`,
    ad.description ? `Описание: ${ad.description}` : null,
    ad.price ? `Цена: ${ad.price}` : null,
    `Характеристики: ${JSON.stringify(ad.params ?? {})}`,
  ]
    .filter(Boolean)
    .join("\n");

  if (task === "generate_description") {
    return `Составь качественное описание объявления на русском языке на основе данных ниже.\n\n${baseInfo}`;
  }

  return `Оцени примерную рыночную стоимость объявления по данным ниже. Ответ дай на русском языке.\n\n${baseInfo}`;
};
