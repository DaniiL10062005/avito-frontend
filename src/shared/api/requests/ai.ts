import type { GetAiAnswerParams } from "@/shared/types/ai";
import { axiosAi } from "../client";
import { AI_SYSTEM_PROMPTS } from "@/shared/constants/ai-system-prompts";
import { buildAiUserPrompt } from "@/shared/utils/build-ai-user-prompt";

export const getAIAnswer = async ({ task, ad }: GetAiAnswerParams) => {
  try {
    const response = await axiosAi.post<Response>("", {
      model: "grok-4.20",
      messages: [
        { role: "system", content: AI_SYSTEM_PROMPTS[task] },
        { role: "user", content: buildAiUserPrompt({ task, ad }) },
      ],
      temperature: 0.7,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
