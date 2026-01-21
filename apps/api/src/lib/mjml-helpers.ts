/**
 * @retuns only the extracted mjml after removing any extract start or ending
 */
export const extractMJMLOnly = (raw: string): string => {
  return raw.replace(/^[\s\S]*?(<mjml[\s\S]*?<\/mjml>)[\s\S]*$/, "$1");
};
