import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';
import {SORT_AIR_RESOURCES, SORT_GROUND_RESOURCES} from '../../types';

@Pipe({
  name: 'sortByPriority',
  pure: false
})
export class SortByPriorityPipe implements PipeTransform {

  transform(array: any, value?: SORT_GROUND_RESOURCES | SORT_AIR_RESOURCES): any {
    if (array.length === 0 || !value) {
      return array;
    }
    // if (value === 'Type') {
    //   value = 'Subclassification';
    // } else if (value === 'Decision Time') {
    //   this.sortByDecisionTime(array);
    //   value = 'orderTTL';
    // } else if (value === 'Altitude') {
    //   value = 'Position.geometry.coordinates[2]';
    // }
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

  private sortByDecisionTime = (arrTargets) => {
    arrTargets.forEach((target) => {
      let temp = 10000;
      target.Engagements.forEach((engage) => {
        let ttl;
        if (engage.Tnow < engage.PlannedLaunchTime && engage.Tnow > 0) {
          ttl = engage.PlannedLaunchTime - engage.Tnow;
          if (temp > ttl) {
            temp = ttl;
          }
        }
      });
      target['orderTTL'] = temp;
    });
  }
}
