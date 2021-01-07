import {Component, forwardRef, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, NG_VALUE_ACCESSOR} from '@angular/forms';
import {animate, animateChild, group, query, state, style, transition, trigger} from '@angular/animations';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {ApplicationService} from '../../../services/applicationService/application.service';

export interface StateGroup {
  letter: string;
  names: string[];
}

export const _filter = (names: string[], value: string): string[] => {
  const res = [];
  const filterValue = value.toLowerCase();
  names.forEach((name) => {
    if (name.toLowerCase().includes(filterValue)) {
      res.push(name);
    }
  });
  return res;
};

@Component({
  selector: 'app-search-panel',
  templateUrl: './search-panel.component.html',
  styleUrls: ['./search-panel.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => SearchPanelComponent),
    }
  ],
  animations: [
    trigger('clearExpand', [
      transition(':enter', [
        style({width: '12em', opacity: 0}),
        group([
          animate(200, style({width: '10em'})),
          animate('100ms 100ms', style({opacity: '{{finalOpacity}}'}))
        ])
      ], {params: {finalOpacity: 1}}),
      transition(':leave', [
        group([
          animate(200, style({width: '12em'})),
          animate('100ms', style({opacity: 0}))
        ])
      ]),
      // TODO: opacity is not good enough. When hidden, button should also be disabled and aria-hidden (or removed completely)
      state('1', style({opacity: '*'})),
      state('0', style({opacity: '0'})),
      transition('1<=>0', animate(200)),
    ]),
    trigger('searchExpand', [
      state('1', style({width: '10em', backgroundColor: '*', margin: '*'})),
      state('0', style({width: '40px', backgroundColor: 'transparent', color: 'white', margin: '0'})),
      transition('0=>1', [
        group([
          style({width: '40px', backgroundColor: 'transparent'}),
          animate(200, style({width: '10em', backgroundColor: '*', color: '*'})),
          query('@inputExpand', [
            style({width: '12em'}),
            animate(200, style({
              width: '10em',
              margin: '*',
            })),
          ]),
          query('@clearExpand', [
            animateChild(),
          ])
        ])
      ]),
      transition('1=>0', [
        group([
          style({width: '10em'}),
          animate(200, style({
            backgroundColor: 'transparent',
            width: '40px',
            color: 'white',
          })),
          query('@clearExpand', [
            animateChild(),
          ]),
          query('@inputExpand', [
            animate(200, style({
              width: '12em',
              backgroundColor: 'transparent',
              opacity: '0',
              margin: '0',
            }))
          ]),
        ])
      ]),
    ]),
    trigger('inputExpand', [
      state('0', style({width: '12em', margin: '0'})),
      // Without this transition, the input animates to an incorrect width
      transition('0=>1', []),
    ]),
  ],
})
export class SearchPanelComponent implements OnInit {

  stateForm: FormGroup = this._formBuilder.group({
    stateGroup: '',
  });
  stateGroupOptions: Observable<StateGroup[]>;

  isOpenSearchPanel = false;


  constructor(public applicationService: ApplicationService,
              private _formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.stateGroupOptions = this.stateForm.get('stateGroup')!.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filterGroup(value))
      );
  }
  private _filterGroup(value: string): StateGroup[] {
    if (value) {
      return this.applicationService.stateGroups
        .map(stateGroup => ({letter: stateGroup.letter, names: _filter(stateGroup.names, value)}))
        .filter(stateGroup => stateGroup.names.length > 0);
    }

    return this.applicationService.stateGroups;
  }

  toggleSearchPanel = () => {
    this.isOpenSearchPanel = !this.isOpenSearchPanel;
  };

}
