export type CalendarEvent = {
  id: string;
  start: {
    date: Date;
    dateTime: string;
  };
  end: {
    date: Date;
    dateTime: string;
  };
};
export type CalendarEventUI = {
  selDate: Date;
  events: CalendarEvent[];
};
