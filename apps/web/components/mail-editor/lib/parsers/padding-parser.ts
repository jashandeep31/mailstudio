import { propertyType } from "../get-properties";

export const paddingParser = (el: HTMLElement): propertyType[] => {
  const rawPaddingValuesString = window.getComputedStyle(el).padding;
  const diffPaddings = rawPaddingValuesString.split(" ");
  const paddingsLength = diffPaddings.length;

  const validNames = [
    "padding-top",
    "padding-right",
    "padding-bottom",
    "padding-left",
  ] as const;

  const validUnits: string[] = ["px", "rem", "em", "%", "vh", "vw"];
  const regex = /(\d*\.?\d+)([a-zA-Z%]+)/;

  // Parse a single padding value
  const parsePadding = (paddingStr: string | undefined) => {
    if (!paddingStr) {
      return { value: "0", unit: "px" };
    }
    const match = paddingStr.match(regex);
    if (match) {
      return {
        value: match[1] || "auto",
        unit: match[2] || "px",
      };
    }
    return { value: "auto", unit: "px" };
  };

  // Map padding values to sides based on CSS shorthand rules
  let paddingValues: (string | undefined)[];

  if (paddingsLength === 1) {
    // All sides same: [top, right, bottom, left] all use [0]
    paddingValues = [
      diffPaddings[0],
      diffPaddings[0],
      diffPaddings[0],
      diffPaddings[0],
    ];
  } else if (paddingsLength === 2) {
    // Vertical | Horizontal: [top, right, bottom, left] = [0, 1, 0, 1]
    paddingValues = [
      diffPaddings[0],
      diffPaddings[1],
      diffPaddings[0],
      diffPaddings[1],
    ];
  } else if (paddingsLength === 3) {
    // Top | Horizontal | Bottom: [top, right, bottom, left] = [0, 1, 2, 1]
    paddingValues = [
      diffPaddings[0],
      diffPaddings[1],
      diffPaddings[2],
      diffPaddings[1],
    ];
  } else {
    // Top | Right | Bottom | Left: explicit all sides
    paddingValues = [
      diffPaddings[0],
      diffPaddings[1],
      diffPaddings[2],
      diffPaddings[3],
    ];
  }

  // Create property objects for each side
  const properties: propertyType[] = validNames.map((name, index) => {
    const { value, unit } = parsePadding(paddingValues[index]);
    return {
      name,
      defaultValue: value,
      validUnits,
      defaultUnit: unit,
    };
  });

  console.log(properties);
  return properties;
};
