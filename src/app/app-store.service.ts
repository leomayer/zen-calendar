import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AppStoreService {
  public readonly state = {
    dateSelected: signal<Date | null>(null),
  } as const;
}
