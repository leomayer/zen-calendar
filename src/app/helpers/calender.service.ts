import { Injectable } from '@angular/core';
import { CalenderEvent } from './calenderTypes';

@Injectable({
  providedIn: 'root',
})
export class CalenderService {
  constructor() {}

  getEvents(curMonth: Date): CalenderEvent[] {
    const ret = [] as CalenderEvent[];
    const sampleToday = this.getSampleEvent();
    const sample1 = this.getSampleEvent();
    sample1.start.date.setDate(new Date().getDate() - 5);
    const sample2 = this.getSampleEvent();
    sample2.start.date.setDate(new Date().getDate() - 5);
    const sample3 = this.getSampleEvent();
    sample3.start.date.setDate(new Date().getDate() - 10);

    ret.push(sampleToday);
    ret.push(sample1);
    ret.push(sample2);
    ret.push(sample3);
    console.log('hast list for: ', curMonth, ret);
    return ret;
  }

  private getSampleEvent(): CalenderEvent {
    return {
      id: 'abc',
      start: {
        date: new Date(),
        dateTime: '',
      },
      end: {
        date: new Date(),
        dateTime: '',
      },
    };
  }
}
