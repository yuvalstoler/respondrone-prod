import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {SearchService} from '../../../services/searchService/search.service';
import {ALL_STATES} from '../../../../types';
import {AIR_VEHICLE_TYPE} from '../../../../../../../classes/typings/all.typings';

export interface StateGroup {
  letter: ALL_STATES;
  names: any[];
}

export const _filter = (names: string[], value: string): string[] => {
  const res = [];
  const filterValue = value.toLowerCase();
  // names.forEach((name) => {
    // if (name.toLowerCase().includes(filterValue)) {
    //   res.push(name);
    // }
// });
  const a = names.filter(name =>
    Object.keys(name).some((k) =>
      name[k].toString().toLowerCase().includes(filterValue))
  );
  if (Array.isArray(a) && a.length > 0) {
    res.push(...a);
  }
  return res;
};

@Component({
  selector: 'app-search-panel',
  templateUrl: './search-panel.component.html',
  styleUrls: ['./search-panel.component.scss']
})
export class SearchPanelComponent implements OnInit {

  stateForm: FormGroup = this._formBuilder.group({
    stateGroup: '',
  });
  stateGroupOptions: Observable<StateGroup[]>;

  isOpenSearchPanel = false;

  ALL_STATES = ALL_STATES;


  constructor(public searchService: SearchService,
              private _formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    if (this.stateForm.get('stateGroup')) {
      this.stateGroupOptions = this.stateForm.get('stateGroup').valueChanges
        .pipe(
          startWith(''),
          map(value => this._filterGroup(value))
        );
    }
  }

  private _filterGroup(value: string): StateGroup[] {
    if (value ) {
      if (typeof value === 'string') {
        this.searchService.getAllGroups();
        return this.searchService.stateGroups
          .map(stateGroup => ({letter: stateGroup.letter, names: _filter(stateGroup.names, value)}))
          .filter(stateGroup => stateGroup.names.length > 0);
      }
    }

    return this.searchService.stateGroups;
  }

  toggleSearchPanel = () => {
    this.isOpenSearchPanel = !this.isOpenSearchPanel;
    if (!this.isOpenSearchPanel) {
    // clear input field
      this.stateForm.get('stateGroup').setValue('');
    } else {
      this.searchService.getAllGroups();
    }
  };

  getValue = (value) => {
    this.searchService.goToElement(value.option.group.label, value.option.value);
  };

  displayFn = (value) => {
    if (typeof value === 'string') {
      return value;
    } else {
      if (value.callSign) {
        return value.callSign;
      } else if (value.type === AIR_VEHICLE_TYPE.Alpha || value.type === AIR_VEHICLE_TYPE.Dji || value.type === AIR_VEHICLE_TYPE.Pixhawk) {
        return value.name;
      } else {
        return 'ID - ' + value['idView'];
      }
      // console.log(value);

    }
  };

  clearPanel = () => {
    this.stateForm.get('stateGroup').setValue('');
  };

}
