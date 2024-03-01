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

export const formatDate4Wordpress = (date: Date | null) => {
  if (date) {
    // get the proper offset of the date (might be a diff between current date and selected date)
    const offset = date.getTimezoneOffset() / -60;
    date.setHours(offset);
    return date.toISOString().split('T')[0];
  }
  return '';
};

/*
 * with this function it is possible to assign a NEW value to a given property
 * NOTE: the additional benefit of this function: the property is dynamic (=string) AND
 * is in accordance to the Typescript config option: "suppressImplicitAnyIndexErrors": false
 */
export const setValue = <T>(obj: T, key: keyof T, value: T[keyof T]) => {
  obj[key] = value;
};
