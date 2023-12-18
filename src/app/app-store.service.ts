import { Injectable } from '@angular/core';
import { ReplaySubject, Subject } from 'rxjs';
import { CalendarEventShort } from './helpers/calenderTypes';

@Injectable({
  providedIn: 'root',
})
export class AppStoreService {
  public readonly state = {
    monthChanged: new Subject<Date>(),
    eventIdSelected: new Subject<CalendarEventShort>(),
    editEvent: new ReplaySubject<CalendarEventShort>(),
    editEvent2Add: new Subject<boolean>(),
    displayEvent: new Subject<CalendarEventShort>(),
  } as const;
}
