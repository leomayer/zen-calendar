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
  // in DB: for the single Event its the cal_basic_id
  eventIds: number[];
  addInfo?: EventFrequ[];
  onlyEventId4Day?: number;
};
export type EventFrequ = {
  frequ_id: number;
  eventStartDate: Date;
  eventEndDate: Date;
  frequType: number; //0: None; 1: weekly; 2: monthly; 3: yearly
  isOnlyEntry4Day: boolean;
};
export type CalendarEventLangs = CalendarEventShort & { lang?: string };

export type CalendarEventUI = {
  selDate: Date;
  lang: string;
  events: CalenderInfo[];
};
export type CalendarEvent = {
  id: number;

  eventStartDate: Date;
  eventStartTime: number;
  eventEndDate: Date;
  eventEndTime: number;
  frequType: number; //0: None; 1: weekly; 2: monthly; 3: yearly
  isOnlyEntry4Day: boolean;
};
export type WordpressString = {
  id: string;

  eventStartDate: string;
  eventStartTime: string;
  eventEndDate: string;
  eventEndTime: string;
  frequType: string;
  isOnlyEntry4Day: string;
};

export type CalenderTimeConfig = {
  eventStartTime: number;
  eventEndTime: number;
  cal_basic_id: number | null;
  eventStartDate: Date;
  eventEndDate: Date;
  frequType: number; //0: None; 1: weekly; 2: monthly; 3: yearly
  isOnlyEntry4Day: boolean;
  configDet: CalenderDetConfig[];
};
export type CalenderDetConfig = {
  id: number | null;
  title: string;
  description: string;
  lang: string;
  link: string;
  linkType: CalLinkType;
};
export type CalLinkType = 'url' | 'zoom' | 'email' | null;
export type CalLinkTypeUI = {
  name: string;
  linkType: CalLinkType;
};
export type FrequTypeUI = {
  name: string;
  frequType: number;
};

export type CalenderInfo = {
  id: number | null;
  title: string;
  description: string;
  eventStartTime: number;
  eventEndTime: number;
  lang: string;
  link: string;
  linkType: CalLinkType;
};
export type CalenderInfoConfig = CalenderInfo & {
  cal_basic_id: number | null;
};
export type CalenderInfoWP = {
  [key in keyof CalenderInfo]: string;
};
export type CalenderInfoConfigWP = {
  [key in keyof CalenderInfoConfig]: string;
};

export class DefaultCalenderInfo implements CalenderInfo {
  id = null;
  title = '';
  description = '';
  eventStartTime = 0;
  eventEndTime = 0;
  lang = 'de';
  link = '';
  linkType = null;
}

export class CalConfigTimeDetail {
  id = new FormControl<number | undefined>(undefined);
  eventStartTime = new FormControl<number>(0);
  eventEndTime = new FormControl<number>(0);
  startTimeUI = new FormControl<string>('00:00');
  endTimeUI = new FormControl<string>('00:00');
  isOnlyEntry4day = new FormControl<boolean>(false);

  frequStart = new FormControl<Date | null>(null);
  frequEnd = new FormControl<Date | null>(null);
  frequType = new FormControl<number>(0);
  fields = new FormArray<FormGroup<CalConfigDetail>>([]);
  isValid = new FormControl<boolean>(false);
}
export class CalConfigDetail {
  id = new FormControl<number | undefined>(undefined);
  title = new FormControl<string>('');
  description = new FormControl<string>('');
  lang = new FormControl<string>('');
  link = new FormControl<string>('');
  linkType = new FormControl<CalLinkType>(null);
}

export interface CalConfigFormDto {
  data: CalenderDetConfig;
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
