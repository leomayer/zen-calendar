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
export class CalendarHelper {
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
              convDetail.eventEndDate = new Date(dtoDetail.eventEndDate);
              convDetail.eventStartDate = new Date(dtoDetail.eventStartDate);
              convDetail.eventEndDate = new Date(dtoDetail.eventEndDate);
              convDetail.eventStartDate = new Date(dtoDetail.eventStartDate);
              convDetail.frequType = Number(dtoDetail.frequType);
              convDetail.isOnlyEntry4Day = !!Number(dtoDetail.isOnlyEntry4Day);
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
    const useEventIds = (data.onlyEventId4Day ??
      data.eventIds.join()) as string;

    return await this.getEventsViaSignal(useEventIds, useLang);
  }
  async getEventsViaSignal(
    eventIds: string,
    lang: string,
  ): Promise<CalenderInfo[]> {
    return await firstValueFrom(
      this.http
        .get<CalenderInfoWP[]>(
          this.host +
            this.url4Wordpress +
            'zenEvent?eventId=' +
            eventIds +
            '&lang=' +
            lang,
        )
        .pipe(map((dto) => this.convertMapCalInfo(dto))),
    );
  }
  async getEventsDetailsByIds(
    listOfCalIds: number[],
  ): Promise<CalenderInfoConfig[]> {
    if (!listOfCalIds) {
      return [];
    }
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
    convDetail.eventStartTime = Number(dtoDetail.eventStartTime);
    convDetail.eventEndTime = Number(dtoDetail.eventEndTime);
    convDetail.lang = dtoDetail.lang;
    convDetail.link = dtoDetail.link;
    convDetail.linkTitle = dtoDetail.linkTitle;
    convDetail.linkType = dtoDetail.linkType as CalLinkType;

    return convDetail;
  }
}
