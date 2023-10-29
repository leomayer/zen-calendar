import { Injectable } from '@angular/core';
import { CalendarEvent } from './calenderTypes';

@Injectable({
  providedIn: 'root',
})
export class CalenderService {
  getEvents(curMonth: Date): CalendarEvent[] {
    const retList = [] as CalendarEvent[];
    const mondays = this.getWeekdaysInMonth(curMonth, 1);
    mondays.forEach((curMonday) => {
      const ret = this.getMondays();
      ret.start.date = curMonday;
      ret.end.date = curMonday;
      retList.push(ret);
    });
    const wednesdays = this.getWeekdaysInMonth(curMonth, 3);
    wednesdays.forEach((curWed) => {
      const ret = this.getWednesdays();
      ret.start.date = curWed;
      ret.end.date = curWed;
      retList.push(ret);
    });

    return retList;
  }

  // targetWeekday:  (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
  getWeekdaysInMonth(date: Date, targetWeekday: number) {
    const year = date.getFullYear();
    const month = date.getMonth();
    const weekdays = [];

    // Calculate the day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday) for the target weekday
    const dayOfWeek = targetWeekday % 7;

    // Calculate the date of the first occurrence of the target weekday in the month
    let firstWeekday =
      1 + ((7 + dayOfWeek - new Date(year, month, 1).getDay()) % 7);

    // Loop through the month and find all occurrences of the target weekday
    while (firstWeekday <= new Date(year, month + 1, 0).getDate()) {
      const weekday = new Date(year, month, firstWeekday);
      weekdays.push(weekday);
      firstWeekday += 7;
    }

    return weekdays;
  }

  private getMondays(): CalendarEvent {
    return {
      id: 'abc',
      start: {
        date: new Date(),
        time: '18:30',
      },
      end: {
        date: new Date(),
        time: '20:30',
      },
      description: `
<p>PRACTICE ON MONDAY (hybrid): 18:30-20:45<br>
Chanting, 2 x 35′ Zen meditation, Q &amp; A/talk.<br>
Head: ZM Hyon Ja.<br>
Zoom link: <a href="https://bit.ly/Monday-Practice" target="_blank" rel="noopener">https://bit.ly/Monday-Practice</a></p>`,
    };
  }
  private getWednesdays(): CalendarEvent {
    return {
      id: 'abc',
      start: {
        date: new Date(),
        time: '07:00',
      },
      end: {
        date: new Date(),
        time: '08:15',
      },
      description: `
<p>WEDNESDAY MORNING ZEN MEDITATION: 07:00-08:10<br>
One hour of early morning Zen meditation.<br>
Head: Leo Welsch, SDT.<br>
The practice will take place at the Zen Center.<br>
(Please register via <a href="mailto:leo_zen@gmx.at" target="_blank" rel="noopener" class="mail-link" data-wpel-link="ignore"><span class="wpmt wpml-rtl"><span class="wpml-sd">ta.xm</span><span class="wpml-nodis">1698600878</span><span class="wpml-sd">g@nez</span><span class="wpml-nodis">1698600878</span><span class="wpml-sd">_oel</span><span class="wpml-nodis">1698600878</span></span></a>.)</p>  `,
    };
  }
}
