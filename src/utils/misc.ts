// miscelleanous utils

import { USER_COLORS } from "../constants/Editor";

export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
};

export const formatDate = (
  date: string,
  options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    year: "numeric",
  }
) => {
  const parsedDate = new Date(date);
  const formattedDate = new Intl.DateTimeFormat("en-US", options).format(
    parsedDate
  );
  return formattedDate;
};

export const generateMarkdownTable = (tableSize: {
  rows: number;
  cols: number;
}) => {
  const { rows, cols } = tableSize;
  const headerRow = Array.from(
    { length: cols },
    (_, index) => `Header ${index + 1}`
  ).join(" | ");
  const separatorRow = Array.from({ length: cols }, () => "---").join(" | ");

  const contentRows = Array.from({ length: rows }, (_, rowIndex) =>
    Array.from(
      { length: cols },
      (_, colIndex) => `R${rowIndex + 1}C${colIndex + 1}`
    ).join(" | ")
  ).join("\n");

  return `| ${headerRow} |\n| ${separatorRow} |\n${contentRows
    .split("\n")
    .map((row) => `| ${row} |`)
    .join("\n")}`;
};

export const downloadMarkdownFile = (filename: string, content: string) => {
  const blob = new Blob([content], { type: "text/markdown" });

  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}.md`;

  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
};

export const debounce = (func: Function, delay: number) => {
  let timeoutId: NodeJS.Timeout;

  return (...args: any) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

export const getUserColor = (
  userId: string,
  userColors: string[] = USER_COLORS
) => {
  const index =
    userId
      .split("")
      .map((char) => char.charCodeAt(0))
      .reduce((acc, curr) => acc + curr, 0) % userColors.length;
  return userColors[index];
};
