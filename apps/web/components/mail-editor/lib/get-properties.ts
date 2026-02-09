import { paddingParser } from "./parsers/padding-parser";

export interface property {
  name: string; // name of property for example padding-top
  defaultUnit?: string; // current value which is before editing
  defaultValue: string | number | undefined; // current default value can 0, red or undefined
  validUnits: string[]; // values those user can select like px, rm or another unit
}
interface getPropertiesResponse {
  name: string;
  properties: property[];
}
/**
 * @returns properties in well formated way, with allowed unit and type
 */
export const getProperties = (
  el: HTMLElement,
  mjmlFullTag: string,
): getPropertiesResponse | null => {
  console.log(el, mjmlFullTag);
  const mjmlTags = ["mj-text", "mj-section", "mj-body"] as const;
  const match = mjmlFullTag.match(/^<([\w-]+)/);
  const tag = match?.[1];
  if (!tag) return null;

  if (mjmlTags.includes(tag as (typeof mjmlTags)[number])) {
    switch (tag) {
      case "mj-section":
        const properties = [...paddingParser(el)];

        break;
    }
  }
  return {
    name: "section",
    properties: [],
  };
  //Steps
  //Only get the properties till the inner custom
  //TODO: rethink above point as it can cause issue
  //Get all properties of thing with proper things
};
