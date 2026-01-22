import fs from "fs";
import path from "path";

export const prompts = {
  "system.newTemplate.properPrompt": () =>
    getFileText("system.new-template.proper-prompt.txt"),

  "content.newTemplate.properPrompt": () =>
    getFileText("content.new-template.proper-prompt.txt"),

  "system.newTemplate.generation": (): string =>
    getFileText("system.new-template.generation.txt"),

  "system.refineTemplate.rewrite": () =>
    getFileText("system.refine-template.rewrite.txt"),

  "system.refineTemplate.applyChanges": () =>
    getFileText("system.refine-template.apply-changes.txt"),

  "system.getTemplateName": () => getFileText("system.get-template-name.txt"),

  "system.getQuestionOverview": () =>
    getFileText("system.get-question-overview.txt"),

  "system.refineTemplate.overview": () =>
    getFileText("system.refine-template.overview.txt"),

  "sytem.createUserInstructions": () =>
    getFileText("system.create-user-instructions.txt"),

  "system.updateUserInstructions": () =>
    getFileText("system.update-user-instructions.txt"),
} as const;

const getFileText = (fileName: string): string => {
  return fs.readFileSync(
    path.join(process.cwd(), "text-files", fileName),
    "utf-8",
  );
};

export const checkAllPromptFiles = () => {
  Object.entries(prompts).forEach(([key, prompt]) => {
    const text = prompt();
    if (!text) {
      console.log(`Warning ⚠️ ⚠️: Prompt '${key}' is empty`);
    }
  });
};
