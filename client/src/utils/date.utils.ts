const options = {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "UTC",
} as const;

export const formatDate = (date: Date | string | undefined) => {
  if (date === undefined) return "Неправильная дата";
  if (date instanceof Date) {
    return date.toLocaleString("ru-RU", options);
  }
  return new Date(date).toLocaleString("ru-RU", options);
};
