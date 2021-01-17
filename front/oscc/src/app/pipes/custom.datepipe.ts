import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'customDate'
})
export class CustomDatePipe extends
  DatePipe implements PipeTransform {
  transform(value: number, now: any): any {
    const diffMS = now - value;
    const diffDay = Math.floor(diffMS / (1000 * 60 * 60 * 24));

    if (diffDay < 1) {
      return super.transform(value, 'HH:mm');
    }
    // else if (diffDay === 1) {
    //   return 'yesterday';
    // }
    else {
      return super.transform(value, 'dd/MM/yy');
    }
  }
}
