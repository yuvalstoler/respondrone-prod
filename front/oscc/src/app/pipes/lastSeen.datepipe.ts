import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'lastSeenDate'
})
export class LastSeenDatePipe extends
  DatePipe implements PipeTransform {
  transform(value: number, now: any): any {
    const diffSeconds = (now - value) / 1000;
    const diffDay = Math.floor(diffSeconds / (60 * 60 * 24));

    if (diffDay < 1) {
      if (diffSeconds < 1) {
        return 'now'
      }
      else if (diffSeconds < 60) {
        return Math.floor(diffSeconds) + ' sec ago'
      }
      else if (diffSeconds < 60 * 60) {
        return Math.floor(diffSeconds / 60) + ' min ago'
      }
      else if (diffSeconds <= 60 * 60 * 24) {
        return Math.floor(diffSeconds / (60 * 60)) + ' hr ago'
      }
      else {
        return super.transform(value, 'HH:mm');
      }
    }
    else if (diffDay === 1) {
      return 'yesterday'
    }
    else {
      return super.transform(value, 'dd/MM/yy');
    }
  }
}
