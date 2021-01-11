import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'separatorString'
})
export class SeparatorStringPipe implements PipeTransform {

  transform(value: string, value1: string): string {
    return value.split(/(?=[A-Z])/).join(' ');
  }

}
