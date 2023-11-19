import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { CalendarEventUI } from './helpers/calenderTypes';

@Injectable({
  providedIn: 'root',
})
export class AppStoreService {
  public readonly state = {
    monthChanged: new Subject<Date>(),
    eventSelected: new Subject<CalendarEventUI>(),
    editEvent: new Subject<CalendarEventUI>(),
  } as const;
}
