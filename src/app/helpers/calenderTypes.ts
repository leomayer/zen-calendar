export type CalendarEvent = {
  id: string;
  start: {
    date: Date;
    time: string;
  };
  end: {
    date: Date;
    time: string;
  };
  description: string;
};
export type CalendarEventUI = {
  selDate: Date;
  events: CalendarEvent[];
};
