import type {
  AIRequest,
  AIResponse,
  GetAiAnswerParams,
} from "@/shared/types/ai";
import { axiosAi } from "../client";
import { AI_SYSTEM_PROMPTS } from "@/shared/constants/ai-system-prompts";
import { buildAiUserPrompt } from "@/shared/utils/build-ai-user-prompt";

export const getAIAnswer = async ({ task, ad }: GetAiAnswerParams) => {
  try {
    const payload: AIRequest = {
      model: import.meta.env.VITE_OLLAMA_MODEL ?? "llama3:latest",
      prompt: `${AI_SYSTEM_PROMPTS[task].trim()}\n\n${buildAiUserPrompt({
        task,
        ad,
      })}`,
      stream: false,
      options: {
        temperature: 0.1,
      },
    };
    const response = await axiosAi.post<AIResponse>("", payload);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
