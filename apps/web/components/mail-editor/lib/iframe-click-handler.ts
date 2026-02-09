import { EditableTag } from "../editor";
import { getProperties } from "./get-properties";

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
        // custom get properties function
        // build to handle the all kinda values if i null but user can add them
        const properties = getProperties(el, fullTag);
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

        // TODO: fix the temp solution
        // TODO: get the properties category so that easy to create the groups in ui
        for (const property of properties) {
          tags.push({
            name: property.name,
            value: property.defaultValue as string,
            preValue: property.defaultValue as string,
          });
        }

        // TODO: testing mj-text only not for production
        // const innertext = el.innerText;
        // if (fullTag.includes("<mj-text")) {
        //   setEditableTags([
        //     ...tags,
        //     { name: "innertext", value: innertext, preValue: innertext },
        //   ]);
        // } else {
        // }
        setEditableTags([...tags]);
      }
      return;
    }
    el = el.parentElement;
  }
}
