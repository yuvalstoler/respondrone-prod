import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'separatorString'
})
export class SeparatorStringPipe implements PipeTransform {

  transform(value: string): string {
    return value.split(/(?=[A-Z])/).join(' ');
  }

}
