import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'minutes2HourMin',
  standalone: true,
})
export class Minutes2HourMinPipe implements PipeTransform {
  transform(minutes: number | undefined, ...args: unknown[]): unknown {
    if (minutes) {
      const date = new Date();
      date.setHours(0, minutes, 0);
      return date.toLocaleTimeString([document.documentElement.lang], {
        hour: '2-digit',
        minute: '2-digit',
      });
    }
    return null;
  }
}
