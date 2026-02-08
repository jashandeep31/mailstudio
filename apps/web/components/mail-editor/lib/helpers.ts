// Generate a random class name

const usedClasses: string[] = [];
function generateRandomClass(): string {
  const randomClass: string =
    "el-" + Math.random().toString(36).substring(2, 10);
  usedClasses.push(randomClass);
  return randomClass;
}

export const getClassesInjectedMJML = (rawCode: string): string => {
  let result = rawCode.replace(
    /<(mj-[a-z-]+)(\s|>)/gi,
    (_match, tagName, after) => {
      const randomClass = generateRandomClass();
      if (after === ">") {
        return `<${tagName} css-class="custom-${randomClass}">`;
      }
      return `<${tagName} css-class="custom-${randomClass}" `;
    },
  );
  console.log(usedClasses, usedClasses.length);
  for (const randomClass of usedClasses) {
    if (!result.includes(randomClass)) {
      console.log(randomClass);
    }
  }

  return result;
};
