import {
  chatVersionOutputsTable,
  chatVersionPromptsTable,
  chatVersionsTable,
} from "@repo/db";

export interface ChatVersionAggregate {
  chat_versions: typeof chatVersionsTable.$inferSelect;
  chat_version_prompts?: typeof chatVersionPromptsTable.$inferSelect;
  chat_version_outputs?: typeof chatVersionOutputsTable.$inferSelect;
}

export type StreamingOverview = {
  versionId: string;
  chatId: string;
  questionId: string;
  response: string;
} | null;
