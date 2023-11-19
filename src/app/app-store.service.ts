import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { CalendarEventShort } from './helpers/calenderTypes';

@Injectable({
  providedIn: 'root',
})
export class AppStoreService {
  public readonly state = {
    monthChanged: new Subject<Date>(),
    eventIdSelected: new Subject<CalendarEventShort>(),
    editEvent: new Subject<CalendarEventShort>(),
    displayEvent: new Subject<CalendarEventShort>(),
  } as const;
}
