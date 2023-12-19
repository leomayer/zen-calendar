import { Injectable } from '@angular/core';
import {
  CalendarEvent,
  WordpressString,
  CalenderInfo,
  CalendarEventLangs,
  CalenderInfoConfig,
  CalenderInfoWP,
  CalenderInfoConfigWP,
  CalLinkType,
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
              convDetail.is_only_entry4day = !!Number(
                dtoDetail.is_only_entry4day,
              );
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
      this.http
        .get<CalenderInfoWP[]>(
          this.host +
            this.url4Wordpress +
            'zenEvent?eventId=' +
            data.eventIds.join().split(',') +
            '&lang=' +
            useLang,
        )
        .pipe(map((dto) => this.convertMapCalInfo(dto))),
    );
  }
  async getEventsDetailsByIds(
    listOfCalIds: number[],
  ): Promise<CalenderInfoConfig[]> {
    return await firstValueFrom(
      this.http
        .get<CalenderInfoConfigWP[]>(
          this.host +
            this.url4Wordpress +
            'zenEventDetails?eventId=' +
            listOfCalIds.join().split(','),
        )
        .pipe(map((dto) => this.convertMapCalInfoDet(dto))),
    );
  }

  convertMapCalInfo(dto: CalenderInfoWP[]) {
    const converted = dto.map((dtoDetail) =>
      this.convertMapCalDetail(dtoDetail),
    );
    return converted;
  }
  convertMapCalInfoDet(dto: CalenderInfoConfigWP[]) {
    const converted = dto.map((dtoDetail) => {
      const basic = this.convertMapCalDetail(
        dtoDetail as CalenderInfoWP,
      ) as CalenderInfoConfig;
      basic.cal_basic_id = Number(dtoDetail.cal_basic_id);
      return basic;
    });
    return converted;
  }

  convertMapCalDetail(dtoDetail: CalenderInfoWP): CalenderInfo {
    const convDetail = {} as CalenderInfo;
    convDetail.id = Number(dtoDetail.id);
    convDetail.title = dtoDetail.title;
    convDetail.description = dtoDetail.description;
    convDetail.startTime = Number(dtoDetail.startTime);
    convDetail.endTime = Number(dtoDetail.endTime);
    convDetail.lang = dtoDetail.lang;
    convDetail.link = dtoDetail.link;
    convDetail.linkType = dtoDetail.linkType as CalLinkType;

    return convDetail;
  }
}
