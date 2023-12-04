import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';

export type CalendarEventShort = {
  start: Date;
  eventIds: number[];
};
export type CalendarEventLangs = CalendarEventShort & { lang?: string };

export type CalendarEventUI = {
  selDate: Date;
  lang: string,
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
export type WordpressString = {
  id: string;

  event_start: string;
  event_end: string;
  frequ_start: string;
  frequ_end: string;
  frequ_type: string;
};

export type CalLinkType = 'url' | 'zoom' | 'email' | undefined;
export type CalLinkTypeUI = {
  name: string;
  linkType: CalLinkType;
};

export type CalenderInfo = {
  title: string;
  description: string;
  startTime: number;
  endTime: number;
  lang: string;
  link: string;
  linkType: CalLinkType;
};

export class CalConfigDetail {
  id = new FormControl<number | undefined>(undefined);
  title = new FormControl<string>('');
  description = new FormControl<string>('');
  startTime = new FormControl<number>(0);
  endTime = new FormControl<number>(0);
  startTimeUI = new FormControl<string>('00:00');
  endTimeUI = new FormControl<string>('00:00');
  lang = new FormControl<string>('');
  link = new FormControl<string>('');
  linkType = new FormControl<CalLinkType>(undefined);
}

export interface CalConfigFormDto {
  data: CalenderInfo;
  fields: FormArray<FormGroup<CalConfigDetail>>;
}

export function timeToMinutesValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const timeString = control.value as string;

    if (
      !timeString ||
      timeString.length !== 5 ||
      !timeString.match(/^(\d{2}):(\d{2})$/)
    ) {
      return { invalidTimeFormat: true };
    }

    const [hours, minutes] = timeString.split(':');
    const totalMinutes = parseInt(hours ?? '0') * 60 + parseInt(minutes ?? '0');

    if (totalMinutes < 0 || totalMinutes > 1440) {
      return { invalidTimeRange: true };
    }

    return null;
  };
}
