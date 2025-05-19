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

// Функция возвращает диапазон даты, начиная с предыдущей недели, заканчивая датой через 3 недели
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

  const days: Number[] = [];
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
    days.push(date);
    itterationDate.setDate(date + 1);
  }

  return { startDate, endDate, days, weeks };
};
