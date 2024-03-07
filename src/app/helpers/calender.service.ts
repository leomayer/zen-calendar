import { Injectable, inject } from '@angular/core';
import {
  CalendarEvent,
  CalendarEventShort,
  EventFrequ,
  FrequType,
} from './calenderTypes';
import { CalendarHelper } from './calender.test-helper.service';
import {
  areDatesOnSameDay,
  getWeekdaysInMonth,
} from './calendar.functions.helper';
import { CalendarStore } from '@app/app-store.service';

@Injectable({
  providedIn: 'root',
})
export class CalenderService {
  readonly calendarStore = inject(CalendarStore);

  constructor(private helper: CalendarHelper) {}

  async getEvents(curMonth: Date): Promise<CalendarEventShort[]> {
    this.calendarStore.setLoading();
    const retList = [] as CalendarEventShort[];
    // get the list from the DB
    try {
      const dbList = await this.helper.getOverview4Month(curMonth);
      this.setFixedDate(dbList, retList);
      this.setRepeatingWeekDates(dbList, retList, curMonth);
      this.setRepeatingDaily(dbList, retList, curMonth);

      retList.sort((a, b) => a.start.getTime() - b.start.getTime());
      this.calendarStore.setLoaded();
    } catch (error) {
      this.calendarStore.setError('Error loading overview month');
    }
    return retList;
  }

  async getEventsDetailsByIds(listOfCalIds: number[]) {
    return await this.helper.getEventsDetailsByIds(listOfCalIds);
  }

  // filter all those events which are not repeating
  setFixedDate(dbList: CalendarEvent[], retList: CalendarEventShort[]) {
    dbList
      .filter((chk) => chk.frequType === 0)
      .forEach((filterDay) => {
        // since its a one day only event ==> StartDate equals EndDate
        this.addDay2List(filterDay.eventStartDate, retList, filterDay);
      });
  }

  setRepeatingDaily(
    dbList: CalendarEvent[],
    retList: CalendarEventShort[],
    curMonth: Date,
  ) {
    this.filterDatesByFequency(dbList, FrequType.DAILY).forEach((filterDay) => {
      for (
        const loopDay = filterDay.eventStartDate;
        loopDay <= filterDay.eventEndDate;

      ) {
        loopDay.setDate(loopDay.getDate() + 1);

        this.addDay2List(loopDay, retList, filterDay);
      }
    });
  }

  setRepeatingWeekDates(
    dbList: CalendarEvent[],
    retList: CalendarEventShort[],
    curMonth: Date,
  ) {
    this.filterDatesByFequency(dbList, FrequType.WEEKLY).forEach(
      (filterDay) => {
        // get for this weekday all dates in this month
        const weekDays = getWeekdaysInMonth(
          curMonth,
          filterDay.eventStartDate.getDay(),
        )
          // filter only those days which are BEFORE the end!!!
          .filter((chkDay) =>
            this.isDateWithinFilterDayInterval(filterDay, chkDay),
          );
        // for each weekday: add the event to the calendar
        weekDays.forEach((weekDay) => {
          this.addDay2List(weekDay, retList, filterDay);
        });
      },
    );
  }

  filterDatesByFequency(dbList: CalendarEvent[], useFrequType: FrequType) {
    return dbList.filter((chk) => chk.frequType === useFrequType);
  }

  addDay2List(
    weekDay: Date,
    retList: CalendarEventShort[],
    filterDay: CalendarEvent,
  ) {
    let addDay = retList.find((chkMapDay) =>
      areDatesOnSameDay(chkMapDay.start, weekDay),
    );
    if (addDay) {
      addDay.eventIds.push(filterDay.id);
      this.appendAddInfo(filterDay, addDay);
    } else {
      const tmpDay = { ...filterDay };
      tmpDay.eventStartDate = weekDay;
      addDay = this.createShortEvent(tmpDay);
      retList.push(addDay);
    }
    this.setOnlyEventInfo(filterDay, addDay);
  }
  setOnlyEventInfo(filterDay: CalendarEvent, addDay: CalendarEventShort) {
    if (
      filterDay.isOnlyEntry4Day &&
      this.isDateWithinFilterDayInterval(filterDay, addDay.start)
    ) {
      addDay.onlyEventId4Day = filterDay.id;
    }
  }
  isDateWithinFilterDayInterval(filterDay: CalendarEvent, checkDay: Date) {
    return (
      (filterDay.eventStartDate < checkDay ||
        areDatesOnSameDay(filterDay.eventStartDate, checkDay)) &&
      (checkDay < filterDay.eventEndDate ||
        areDatesOnSameDay(filterDay.eventEndDate, checkDay))
    );
  }

  createShortEvent(filterDay: CalendarEvent) {
    const addDay: CalendarEventShort = {
      start: filterDay.eventStartDate,
      eventIds: [filterDay.id],
    };
    this.appendAddInfo(filterDay, addDay);
    return addDay;
  }

  appendAddInfo(filterDay: CalendarEvent, addDay: CalendarEventShort) {
    if (this.calendarStore.useConfigInterface()) {
      const addInfo = {
        frequ_id: filterDay.id,
        eventStartDate: filterDay.eventStartDate,
        eventEndDate: filterDay.eventEndDate,
        frequType: filterDay.frequType,
        isOnlyEntry4Day: filterDay.isOnlyEntry4Day,
      } as EventFrequ;
      if (addDay.addInfo?.length) {
        addDay.addInfo.push(addInfo);
      } else {
        addDay.addInfo = [addInfo];
      }
    }
  }
}
