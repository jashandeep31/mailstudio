import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

export const prompts = {
  "system.newTemplate.properPrompt": () =>
    getFileText("system.new-template.proper-prompt.txt"),

  "content.newTemplate.properPrompt": () =>
    getFileText("content.new-template.proper-prompt.txt"),

  "system.newTemplate.generation": (): string =>
    getFileText("system.new-template.generation.txt"),
} as const;

const getFileText = (fileName: string): string => {
  return fs.readFileSync(
    path.join(process.cwd(), "text-files", fileName),
    "utf-8",
  );
};
