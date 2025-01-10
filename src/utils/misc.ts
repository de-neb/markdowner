// miscelleanous utils

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
