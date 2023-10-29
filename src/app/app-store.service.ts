import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AppStoreService {
  public readonly state = {
    monthChanged: new Subject<Date>(),
  } as const;
}
