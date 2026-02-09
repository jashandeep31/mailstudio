import { Dispatch, SetStateAction, useEffect } from "react";
import { EditableTag } from "@/components/mail-editor/editor";
import { applyTagEdits } from "@/components/mail-editor/lib/tag-editor";

interface UseDebouncedTagEditsParams {
  currentEditingFullTag: string | null;
  editableTags: EditableTag[];
  activeMJML: string;
  setEditedMJML: (mjml: string) => void;
  setCurrentEditingFullTag: (tag: string) => void;
  setEditableTags: Dispatch<SetStateAction<EditableTag[]>>;
}

export function useDebouncedTagEdits({
  currentEditingFullTag,
  editableTags,
  activeMJML,
  setEditedMJML,
  setCurrentEditingFullTag,
  setEditableTags,
}: UseDebouncedTagEditsParams) {
  // Handling the values changes
  useEffect(() => {
    if (!currentEditingFullTag) return;
    // checking if some values are changed by the use eer
    const hasChanges = editableTags.some((t) => t.value !== t.preValue);
    if (!hasChanges) return;

    // debounce if user is still updating the values
    const timer = setTimeout(() => {
      const { newMJML, updatedTag } = applyTagEdits({
        currentEditingFullTag,
        editableTags,
        activeMJML,
      });
      setEditedMJML(newMJML);
      setCurrentEditingFullTag(updatedTag);
      setEditableTags((prev) => prev.map((t) => ({ ...t, preValue: t.value })));
    }, 1000);

    return () => clearTimeout(timer);
  }, [
    editableTags,
    currentEditingFullTag,
    activeMJML,
    setEditedMJML,
    setCurrentEditingFullTag,
    setEditableTags,
  ]);
}
