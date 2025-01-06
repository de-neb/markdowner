import { remark } from "remark";
import html from "remark-html";
import remarkGfm from "remark-gfm";

export const stringToMarkdown = async (value: string) => {
  const file = await remark().use(html).use(remarkGfm).process(`${value}`);
  return file;
};
