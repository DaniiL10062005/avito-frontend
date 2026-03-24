export type AiModel = "grok-4.20";
export type AiRole = "system" | "user";
export type AiTask = "generate_description" | "estimate_market_price";

export type AIRequest = {
  model: AiModel;
  messages: [
    { role: "system"; content: string },
    { role: "user"; content: string },
  ];
  temperature: number;
};

export type AdAiContext = {
  category: string;
  title: string;
  description?: string;
  price?: number;
  params?: Record<string, unknown>;
};

export type GetAiAnswerParams = {
  task: AiTask;
  ad: AdAiContext;
};
