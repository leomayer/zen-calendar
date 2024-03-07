import { FormArray, FormControl, FormGroup } from '@angular/forms';

export type CalendarEventShort = {
  start: Date;
  // in DB: for the single Event its the calBasicId
  eventIds: number[];
  addInfo?: EventFrequ[];
  onlyEventId4Day?: number;
};

//0: None; 1: weekly; 2: monthly; 3: yearly; 4 daily
export enum FrequType {
  NONE = 0,
  WEEKLY = 1,
  MONTHLY,
  YEARLY,
  DAILY = 4,
}

export type EventFrequ = {
  frequ_id: number;
  eventStartDate: Date;
  eventEndDate: Date;
  frequType: FrequType;
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
  frequType: FrequType;
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
  calBasicId: number | null;
  eventStartDate: Date;
  eventEndDate: Date;
  frequType: FrequType;
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
  linkTitle: string;
};
export type CalLinkType = 'url' | 'zoom' | 'email' | null;
export type CalLinkTypeUI = {
  name: string;
  linkType: CalLinkType;
};
export type FrequTypeUI = {
  name: string;
  frequType: FrequType;
};
export type WordpressUpdateDetails = {
  [key in keyof CalenderDetConfig]: string;
} & {
  calBasicId: string;
  isUpdate: string;
};
export type WordpressUpdateBasic = WordpressString & {
  isValid: string;
  isUpdate: string;
};

export type CalenderInfo = {
  id: number | null;
  calBasicId: number | null;
  title: string;
  description: string;
  eventStartTime: number;
  eventEndTime: number;
  lang: string;
  link: string;
  linkType: CalLinkType;
  linkTitle: string;
};
export type CalenderInfoConfig = CalenderInfo & {
  calBasicId: number | null;
};
export type CalenderInfoWP = {
  [key in keyof CalenderInfo]: string;
};
export type CalenderInfoConfigWP = {
  [key in keyof CalenderInfoConfig]: string;
};

export class DefaultCalenderInfoDe implements CalenderInfo {
  id = null;
  calBasicId = null;
  title = '';
  description = '';
  eventStartTime = 0;
  eventEndTime = 0;
  lang = 'de';
  link = '';
  linkType = null;
  linkTitle = '';
}
export class DefaultCalenderInfoEn extends DefaultCalenderInfoDe {
  override lang = 'en';
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
  frequType = new FormControl<FrequType>(0);
  fields = new FormArray<FormGroup<CalConfigDetail>>([]);
  isValid = new FormControl<boolean>(false);
}
export class CalConfigDetail {
  id = new FormControl<number | undefined>(undefined);
  calBasicId = new FormControl<number | undefined>(undefined);
  title = new FormControl<string>('');
  description = new FormControl<string>('');
  lang = new FormControl<string>('');
  link = new FormControl<string>('');
  linkType = new FormControl<CalLinkType>(null);
  linkTitle = new FormControl<string>('');
}

export interface CalConfigFormDto {
  data: CalenderDetConfig;
  fields: FormArray<FormGroup<CalConfigDetail>>;
}

export const isFrequType = (obj: unknown): obj is FrequType => {
  const chkNumber =
    typeof obj === 'number' && (obj === 0 || obj === 1 || obj === 4);
  const chkString =
    typeof obj === 'string' && (obj === '0' || obj === '1' || obj === '4');
  return chkNumber || chkString;
};
