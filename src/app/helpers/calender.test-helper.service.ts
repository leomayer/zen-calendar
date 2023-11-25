import { Injectable } from '@angular/core';
import {
  CalendarEvent,
  WordpressString,
  CalenderInfo,
  CalendarEventLangs,
} from './calenderTypes';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, map } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CalendarTestHelper {
  url4testing = '/assets/samples/';
  host = (environment?.host ? environment?.host : location.origin) + '/';
  url4Wordpress = '/wp-json/zen_calendar/v1/';
  constructor(private http: HttpClient) {}

  async getOverview4Month(curMonth: Date): Promise<CalendarEvent[]> {
    const formatDate = curMonth.toISOString().split('T')[0];
    return await firstValueFrom(
      this.http
        .get<WordpressString[]>(
          this.host +
            this.url4Wordpress +
            'calendar4month?useMonth=' +
            formatDate,
        )
        .pipe(
          map((dto) => {
            const converted = dto.map((dtoDetail) => {
              const convDetail = {} as CalendarEvent;
              convDetail.id = Number(dtoDetail.id);
              convDetail.frequ_end = new Date(dtoDetail.frequ_end);
              convDetail.frequ_start = new Date(dtoDetail.frequ_start);
              convDetail.event_end = new Date(dtoDetail.event_end);
              convDetail.event_start = new Date(dtoDetail.event_start);
              convDetail.frequ_type = Number(dtoDetail.frequ_type);
              return convDetail;
            });
            return converted;
          }),
        ),
    );
  }

  async getEventsByIds(data: CalendarEventLangs): Promise<CalenderInfo[]> {
    const useLang =
      (data.lang ?? document.documentElement.lang)?.substring(0, 2) ?? 'en';
    return await firstValueFrom(
      this.http.get<CalenderInfo[]>(
        this.host +
          this.url4Wordpress +
          'zenEvent?eventId=' +
          data.eventIds.join().split(',') +
          '&lang=' +
          useLang,
      ),
    );
  }
  async getEventsDetailsByIds(listOfCalIds: number[]): Promise<CalenderInfo[]> {
    return await firstValueFrom(
      this.http.get<CalenderInfo[]>(
        this.host +
          this.url4Wordpress +
          'zenEventDetails?eventId=' +
          listOfCalIds.join().split(','),
      ),
    );
  }
}
