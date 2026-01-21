/**
 * @retuns only the extracted mjml after removing any extra things from start or ending
 */
export const extractMJMLOnly = (raw: string): string => {
  return raw.replace(/^[\s\S]*?(<mjml[\s\S]*?<\/mjml>)[\s\S]*$/, "$1");
};
