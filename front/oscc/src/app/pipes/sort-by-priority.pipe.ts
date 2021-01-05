import {Pipe, PipeTransform} from '@angular/core';
import * as _ from 'lodash';
import {SORT_AIR_RESOURCES, SORT_GROUND_RESOURCES} from '../../types';

@Pipe({
  name: 'sortByPriority',
  pure: false
})
export class SortByPriorityPipe implements PipeTransform {

  transform(array: any, value?: {type: string, field: string }): any {
    if (array.length === 0 || !value) {
      return array;
    }
    let newValue = '';
      // Ground Resources =======================================================
    if (value.type === 'SORT_GROUND_RESOURCES') {
      if (value.field === SORT_GROUND_RESOURCES.lastUpdate) {
        newValue = 'lastUpdated.timestamp';
      } else if (value.field === SORT_GROUND_RESOURCES.resourceType) {
        newValue = 'type';
      } else if (value.field === SORT_GROUND_RESOURCES.status) {
        newValue = 'online';
      }
    }
        //  Air Resources =========================================================
    else if (value.type === 'SORT_AIR_RESOURCES') {
      if (value.field === SORT_AIR_RESOURCES.lastUpdate) {
        newValue = 'lastUpdateTimeFromDrone.timestamp';
      } else if (value.field === SORT_AIR_RESOURCES.UAVType) {
        newValue = 'type';
      } else if (value.field === SORT_AIR_RESOURCES.status) {
        newValue = 'operationalStatus';
      } else if (value.field === SORT_AIR_RESOURCES.missionType) {
        newValue = 'missionName';
      } else if (value.field === SORT_AIR_RESOURCES.UAVEnergy) {
        newValue = 'energyLevel';
      }
    }


    return array.sort((a: any, b: any) => {
      const valA = _.get(a, newValue);
      const valB = _.get(b, newValue);
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
