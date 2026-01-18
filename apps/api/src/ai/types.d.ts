export type StreamingAiFunctionResponse = {
  output: { text: string; done: boolean };
  inputTokensCost: number;
  outputTokensCost: number;
};
