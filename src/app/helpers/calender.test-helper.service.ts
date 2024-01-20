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
  WordpressUpdateDetails,
  WordpressUpdateBasic,
} from './calenderTypes';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { formatDate4Wordpress } from './calendar.functions.helper';

@Injectable({
  providedIn: 'root',
})
export class CalendarHelper {
  host = (environment?.host ? environment?.host : location.origin) + '/';
  url4Wordpress = '/wp-json/zen_calendar/v1/';
  urlLocation = this.host + this.url4Wordpress;
  constructor(private http: HttpClient) {}

  async getOverview4Month(curMonth: Date): Promise<CalendarEvent[]> {
    return await firstValueFrom(
      this.http
        .get<WordpressString[]>(
          this.urlLocation +
            'calendar4month?useMonth=' +
            formatDate4Wordpress(curMonth),
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
          this.urlLocation + 'zenEvent?eventId=' + eventIds + '&lang=' + lang,
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
          this.urlLocation +
            'zenEventDetails?eventId=' +
            listOfCalIds.join().split(','),
        )
        .pipe(map((dto) => this.convertMapCalInfoDet(dto))),
    );
  }

  async updateEventDetails(updateDetails: WordpressUpdateDetails) {
    await firstValueFrom(
      this.http.post(this.urlLocation + 'updateDetails', updateDetails),
    );
  }
  async updateEventBasic(updateBasics: WordpressUpdateBasic): Promise<number> {
    return await firstValueFrom(
      this.http.post<number>(this.urlLocation + 'updateBasics', updateBasics),
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
      basic.calBasicId = Number(dtoDetail.calBasicId);
      return basic;
    });
    return converted;
  }

  convertMapCalDetail(dtoDetail: CalenderInfoWP): CalenderInfo {
    const convDetail = {} as CalenderInfo;
    convDetail.id = Number(dtoDetail.id);
    convDetail.calBasicId = Number(dtoDetail.calBasicId);
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
