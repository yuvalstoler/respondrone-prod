import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';
import {SORT_AIR_RESOURCES, SORT_GROUND_RESOURCES} from '../../types';

@Pipe({
  name: 'sortByPriority',
  pure: false
})
export class SortByPriorityPipe implements PipeTransform {

  transform(array: any, value?: string): any {
    if (array.length === 0 || !value) {
      return array;
    }
    if (value === SORT_GROUND_RESOURCES.lastUpdate) {
      value = 'lastUpdated.timestamp';
    } else if (value === SORT_GROUND_RESOURCES.resourceType) {
      value = 'type';
    } else if (value === SORT_GROUND_RESOURCES.status) {
      value = 'status';
    }
    return array.sort((a: any, b: any) => {
      const valA = _.get(a, value);
      const valB = _.get(b, value);
      if (valA < valB) {
        return -1;
      } else if (valA > valB) {
        return 1;
      } else {
        return 0;
      }
  });
  }
}
