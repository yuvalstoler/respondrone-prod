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
  // for search animate
  _value = '';
  expanded = false;
  // for autocomplete
  // stateForm: FormGroup = this._formBuilder.group({
  //   stateGroups: '';
  // });

  stateGroupOptions: any /*Observable<StateGroup[]>*/;
  private stateGroup: string = '';


  constructor(public applicationService: ApplicationService,
              private _formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
  //   this.stateGroupOptions = this.stateGroups/*this.applicationService.getStateGroups('stateGroup')!*/
  //   .valueChanges
  // //     .pipe(
  //   .startWith('')
  //   .map(value => this._filterGroup(value));
  // //     );
  }

  doFilter(searchText) {
    this.stateGroupOptions = this.applicationService.stateGroups
      // .valueChanges
      // .pipe(
      // .startWith('')
       .map(value => this._filterGroup(searchText));
        // );
  }

  private _filterGroup(value: any): any[] {
    let c = [];
    const a = [];
    if (value) {
      // const a = this.applicationService.stateGroups
      //   .map(stateGroup => ({letter: stateGroup.letter, names: _filter(stateGroup.names, value)}))
      //   .filter(groupb => groupb.names.length > 0);
      // console.log(a);
      // // if (b[0].hasOwnProperty('names') && Array.isArray(b[0].names) && b[0].names.length > 0 ) {
      // //   c = b[0].names;
      // // }
      // return a;
      this.applicationService.stateGroups.forEach((stateGroup, index) => {
        const res = this.filter(stateGroup.names, value);
        const data = res.filter(names => names.length > 0);
        if (Array.isArray(data) && data.length > 0) {
          if (a.findIndex((letter) => letter.letter === value) !== -1 /* && a[index].hasOwnProprty('letter')*/) {
            // a[index].names = [];
            // a[index].names.push(...res);
          } else {
            // a[index] = a[index] || [];
            // a[index].names = [];
            // a[index].names.push(...res);
            a.push({letter: stateGroup.letter, names: res});
          }

          // a[stateGroup.letter].push(names: ''});
        }
      });
      console.log(a);
return a;
    }

    return this.applicationService.stateGroups;
  }

  private filter = (names: string[], value: string): string[] => {
    const res = [];
    const filterValue = value.toLowerCase();
    names.forEach((name) => {
      if (name.toLowerCase().includes(filterValue)) {
        res.push(name);
      }
    });
    // .filter(item => item.toLowerCase().indexOf(filterValue) === 0);

    return res;
  };


  // Search bar ====================================================================================================
  close = () => {
    this._value = '';
  };

  onSearchClicked = () => {
    this.expanded = !this.expanded;
  };

  onBlur = () => {
    if (!(this._value && this._value.length > 0)) {
      this.expanded = false;
    }
  };

  onChangeValue = (value) => {
    console.log(value);
  };

}
