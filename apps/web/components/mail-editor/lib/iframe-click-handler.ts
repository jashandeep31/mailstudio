import { EditableTag } from "../editor";

interface HandleIframeClickParams {
  e: MouseEvent;
  processedMJML: string;
  setCurrentEditingFullTag: (tag: string) => void;
  setEditableTags: (tags: EditableTag[]) => void;
}

export function handleIframeClick({
  e,
  processedMJML,
  setCurrentEditingFullTag,
  setEditableTags,
}: HandleIframeClickParams) {
  e.preventDefault();
  e.stopPropagation();
  let el = e.target as HTMLElement | null;
  while (el) {
    const hasCustomClass = Array.from(el.classList).some((cls) =>
      cls.startsWith("custom-el-"),
    );
    if (hasCustomClass) {
      // getting the full custom class along with the random id
      const customClass = Array.from(el.classList).find((cls) =>
        cls.startsWith("custom-el-"),
      );

      if (!customClass) return;

      const regex = new RegExp(
        `<(mj-[a-z-]+)([^>]*?)css-class="${customClass}"([^>]*)>`,
        "i",
      );

      const match = processedMJML.match(regex);
      if (match) {
        const fullTag = match[0];
        setCurrentEditingFullTag(fullTag);

        // getting and putting the attributes
        // TODO: this only add the presents write the rules to append more
        const attrRegex = /([a-z-]+)="([^"]*)"/gi;
        const tags: EditableTag[] = [];

        let attrMatch;
        while ((attrMatch = attrRegex.exec(fullTag)) !== null) {
          const attrName = attrMatch[1]!;
          if (attrName === "css-class") continue;
          tags.push({
            name: attrName,
            value: attrMatch[2]!,
            preValue: attrMatch[2]!,
          });
        }
        const innertext = el.innerText;

        // TODO: testing mj-text only not for production
        if (fullTag.includes("<mj-text")) {
          setEditableTags([
            ...tags,
            { name: "innertext", value: innertext, preValue: innertext },
          ]);
        } else {
          setEditableTags([...tags]);
        }
      }
      return;
    }
    el = el.parentElement;
  }
}
