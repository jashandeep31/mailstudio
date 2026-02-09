import { property } from "../get-properties";

export const marginParser = (el: HTMLElement): property[] => {
  const rawMarginValuesString = window.getComputedStyle(el).margin;
  const diffMargins = rawMarginValuesString.split(" ");
  const marginsLength = diffMargins.length;

  const validNames = [
    "margin-top",
    "margin-right",
    "margin-bottom",
    "margin-left",
  ] as const;

  const validUnits: string[] = ["px", "rem", "em", "%", "vh", "vw"];
  const regex = /(\d*\.?\d+)([a-zA-Z%]+)/;

  // Parse a single margin value
  const parseMargin = (marginStr: string | undefined) => {
    if (!marginStr) {
      return { value: "0", unit: "px" };
    }
    const match = marginStr.match(regex);
    if (match) {
      return {
        value: match[1] || "auto",
        unit: match[2] || "px",
      };
    }
    return { value: "auto", unit: "px" };
  };

  // Map margin values to sides based on CSS shorthand rules
  let marginValues: (string | undefined)[];

  if (marginsLength === 1) {
    // All sides same: [top, right, bottom, left] all use [0]
    marginValues = [
      diffMargins[0],
      diffMargins[0],
      diffMargins[0],
      diffMargins[0],
    ];
  } else if (marginsLength === 2) {
    // Vertical | Horizontal: [top, right, bottom, left] = [0, 1, 0, 1]
    marginValues = [
      diffMargins[0],
      diffMargins[1],
      diffMargins[0],
      diffMargins[1],
    ];
  } else if (marginsLength === 3) {
    // Top | Horizontal | Bottom: [top, right, bottom, left] = [0, 1, 2, 1]
    marginValues = [
      diffMargins[0],
      diffMargins[1],
      diffMargins[2],
      diffMargins[1],
    ];
  } else {
    // Top | Right | Bottom | Left: explicit all sides
    marginValues = [
      diffMargins[0],
      diffMargins[1],
      diffMargins[2],
      diffMargins[3],
    ];
  }

  // Create property objects for each side
  const properties: property[] = validNames.map((name, index) => {
    const { value, unit } = parseMargin(marginValues[index]);
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
