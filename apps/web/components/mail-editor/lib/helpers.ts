// Generate a random class name

function generateRandomClass(): string {
  const randomClass: string =
    "el-" + Math.random().toString(36).substring(2, 10);
  return randomClass;
}

export const getClassesInjectedMJML = (rawCode: string): string => {
  const result = rawCode.replace(
    /<(mj-[a-z-]+)(\s|>)/gi,
    (_match, tagName, after) => {
      const randomClass = generateRandomClass();
      if (after === ">") {
        return `<${tagName} css-class="custom-${randomClass}">`;
      }
      return `<${tagName} css-class="custom-${randomClass}" `;
    },
  );

  return result;
};
