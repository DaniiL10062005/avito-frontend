export type AiTask = "generate_description" | "estimate_market_price";

export type AIRequest = {
  model: string;
  prompt: string;
  stream: false;
  options?: {
    temperature?: number;
  };
};

export type AIResponse = {
  model: string;
  created_at: string;
  response: string;
  done: boolean;
  done_reason?: string;
  context?: number[];
  total_duration?: number;
  load_duration?: number;
  prompt_eval_count?: number;
  prompt_eval_duration?: number;
  eval_count?: number;
  eval_duration?: number;
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
