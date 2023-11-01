// targetWeekday:  (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
export const getWeekdaysInMonth = (date: Date, targetWeekday: number) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const weekdays = [];

  // Calculate the day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday) for the target weekday
  const dayOfWeek = targetWeekday % 7;

  // Calculate the date of the first occurrence of the target weekday in the month
  let firstWeekday =
    1 + ((7 + dayOfWeek - new Date(year, month, 1).getDay()) % 7);

  // Loop through the month and find all occurrences of the target weekday
  while (firstWeekday <= new Date(year, month + 1, 0).getDate()) {
    const weekday = new Date(year, month, firstWeekday);
    weekdays.push(weekday);
    firstWeekday += 7;
  }

  return weekdays;
};

export const isToday = (checkDate: Date) => {
  return areDatesOnSameDay(new Date(), checkDate);
};
export const areDatesOnSameDay = (date1: Date, date2: Date) => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};
