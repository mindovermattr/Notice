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
    return new Date(
      Date.UTC(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        date.getHours(),
        date.getMinutes(),
        date.getSeconds()
      )
    ).toLocaleString("ru-RU", options);
  }
  const tempDate = new Date(date);

  const UTCDate = new Date(
    Date.UTC(
      tempDate.getFullYear(),
      tempDate.getMonth(),
      tempDate.getDate(),
      tempDate.getHours(),
      tempDate.getMinutes(),
      tempDate.getSeconds()
    )
  ).toLocaleString("ru-RU", options);

  return UTCDate;
};
