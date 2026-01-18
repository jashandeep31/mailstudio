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
