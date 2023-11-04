import { Injectable } from '@angular/core';
import { CalendarEvent, CalenderInfo } from './calenderTypes';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CalendarTestHelper {
  url = '/assets/samples/';
  constructor(private http: HttpClient) {}

  getOverview4Month(curMonth: Date): CalendarEvent[] {
    const ret = [] as CalendarEvent[];
    const monday1 = {} as CalendarEvent;
    monday1.id = -2;
    monday1.event_start = new Date('2020-01-06T03:00:00');
    monday1.event_end = new Date('2020-01-06T03:00:00');
    monday1.frequ_start = new Date('2020-01-06T03:00:00');
    monday1.frequ_type = 1;
    ret.push(monday1);

    const wednesday1 = {} as CalendarEvent;
    wednesday1.id = -15;
    wednesday1.event_start = new Date('2020-01-01T03:30:00');
    wednesday1.event_end = new Date('2020-01-01T03:30:00');
    wednesday1.frequ_start = new Date('2020-01-01T03:35:00');
    wednesday1.frequ_type = 1;
    ret.push(wednesday1);

    const wednesday2 = {} as CalendarEvent;
    wednesday2.id = -150;
    wednesday2.event_start = new Date('2020-01-01T03:30:00');
    wednesday2.event_end = new Date('2020-01-01T03:30:00');
    wednesday2.frequ_start = new Date('2020-01-01T03:35:00');
    wednesday2.frequ_type = 1;
    ret.push(wednesday2);

    const testDate = {} as CalendarEvent;
    testDate.id = -26;

    testDate.event_start = new Date(curMonth);
    testDate.event_start.setDate(18);
    testDate.event_end = testDate.event_start;
    testDate.frequ_type = 0;
    ret.push(testDate);

    return ret;
  }

  async getEventsByIds(eventIds: number[]) {
    const ret = [] as CalenderInfo[];
    for (let eventId of eventIds) {
      if (eventId === -2) {
        const event = await this.getHttpResult('monday-reg.json');
        ret.push(...event);
      }
    }
    return ret;
  }

  async getHttpResult(strJson: string): Promise<CalenderInfo[]> {
    return await firstValueFrom(
      this.http.get<CalenderInfo[]>(this.url + strJson),
    );
  }
}