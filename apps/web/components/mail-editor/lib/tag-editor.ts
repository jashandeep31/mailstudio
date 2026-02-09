import { EditableTag } from "../editor";

interface ApplyTagEditsParams {
  currentEditingFullTag: string;
  editableTags: EditableTag[];
  activeMJML: string;
}

interface ApplyTagEditsResult {
  newMJML: string;
  updatedTag: string;
}

export function applyTagEdits({
  currentEditingFullTag,
  editableTags,
  activeMJML,
}: ApplyTagEditsParams): ApplyTagEditsResult {
  let updatedTag = currentEditingFullTag;
  for (const tag of editableTags) {
    if (tag.value !== tag.preValue) {
      updatedTag = updatedTag.replace(
        `${tag.name}="${tag.preValue}"`,
        `${tag.name}="${tag.value}"`,
      );
    }
  }
  const newMJML = activeMJML.replace(currentEditingFullTag, updatedTag);
  return { newMJML, updatedTag };
}
