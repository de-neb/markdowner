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
