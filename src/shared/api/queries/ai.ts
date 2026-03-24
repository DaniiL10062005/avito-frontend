import { useMutation } from "@tanstack/react-query";
import { getAIAnswer } from "../requests/ai";
import type { GetAiAnswerParams } from "@/shared/types/ai";

export const useGetAiAnswer = () =>
  useMutation({
    mutationFn: ({ task, ad }: GetAiAnswerParams) => getAIAnswer({ task, ad }),
  });
