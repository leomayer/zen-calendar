export type CalendarEventShort = {
  start: Date;
  eventIds: number[];
};

export type CalendarEventUI = {
  selDate: Date;
  events: CalendarEvent[];
};
export type CalendarEvent = {
  id: number;

  event_start: Date;
  event_end: Date;
  frequ_start: Date;
  frequ_end: Date;
  frequ_type: number; //0: None; 1: weekly; 2: monthly; 3: yearly
  frequ_day: number; // at which day of the week/month/year the event is repeated
  //(0 = Sunday, 1 = Monday, ..., 6 = Saturday) for the target weekday
};
