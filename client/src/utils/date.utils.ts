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

export const getMonthDate = (currentDate: Date) => {
  const tempDate = new Date(currentDate);

  const dayOfWeek = tempDate.getDay();
  const daysToLastMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

  const startDate = new Date(currentDate);
  startDate.setDate(tempDate.getDate() - daysToLastMonday - 7); // понедельник с прошлой недели
  startDate.setHours(0, 0, 0, 0);

  const endDate = new Date(tempDate);
  endDate.setDate(tempDate.getDate() - daysToLastMonday + 21); // понедельник через 3 недели
  endDate.setHours(0, 0, 0, 0);

  const days: Date[] = [];
  const weeks: String[] = [];

  const itterationDate = new Date(startDate);
  const formatter = new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "short",
  });

  while (itterationDate < endDate) {
    const date = itterationDate.getDate();
    const dayOfTheWeek = itterationDate.getDay();
    // Понедельник
    if (dayOfTheWeek === 1) {
      const tempDate = new Date(
        Date.UTC(
          itterationDate.getFullYear(),
          itterationDate.getMonth(),
          itterationDate.getDate() + 6 // вс
        )
      );
      weeks.push(formatter.formatRange(itterationDate, tempDate));
    }
    days.push(new Date(itterationDate));
    itterationDate.setDate(date + 1);
  }
  return { startDate, endDate, days, weeks };
};

export const serverFormatDate = (input: string | undefined) => {
  if (!input) return;
  const date = new Date(input);
  date.setTime(date.getTime() + 3 * 60 * 60 * 1000);

  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // Месяцы с 0
  const year = date.getUTCFullYear();

  const hours = String(date.getUTCHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");

  return `${day}.${month}.${year} ${hours}:${minutes}`;
};
