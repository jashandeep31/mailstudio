export type StreamingAiFunctionResponse = {
  output: { text: string; done: boolean };
  inputTokensCost: number;
  outputTokensCost: number;
};

export type AiFunctionResponse = {
  outputText: string;
  inputTokensCost: number;
  outputTokensCost: number;
};

/**
 * Function is used to return the code along with the prompt
 */
export type AiGeneratedTemplate = {
  outputCode: string;
  prompt: string;
  inputTokensCost: number;
  outputTokensCost: number;
};
