export type CalenderEvent = {
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
