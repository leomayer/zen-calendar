export type CalendarEventShort = {
  start: Date;
  eventIds: number[];
};

export type CalendarEventUI = {
  selDate: Date;
  events: CalenderInfo[];
};
export type CalendarEvent = {
  id: number;

  event_start: Date;
  event_end: Date;
  frequ_start: Date;
  frequ_end: Date;
  frequ_type: number; //0: None; 1: weekly; 2: monthly; 3: yearly
};

export type CalenderInfo = {
  title: string;
  description: string;
  startTime: number;
  endTime: number;
  lang: string;
  link: string;
  linkType: 'zoom'|'email'|undefined;
};
