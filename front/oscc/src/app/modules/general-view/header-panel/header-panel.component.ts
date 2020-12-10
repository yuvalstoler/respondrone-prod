import {Component, ElementRef, forwardRef, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {HEADER_BUTTONS, VIDEO_OR_MAP, VIEW_LIST} from 'src/types';
import {ApplicationService} from 'src/app/services/applicationService/application.service';
import {DefaultValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {animate, animateChild, group, query, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-header-panel',
  templateUrl: './header-panel.component.html',
  styleUrls: ['./header-panel.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => HeaderPanelComponent),
    }
  ],
  animations: [
    trigger('clearExpand', [
      transition(':enter', [
        style({width: '0', opacity: 0}),
        group([
          animate(200, style({width: '*'})),
          animate('100ms 100ms', style({opacity: '{{finalOpacity}}'}))
        ])
      ], {params: {finalOpacity: 1}}),
      transition(':leave', [
        group([
          animate(200, style({width: '0px'})),
          animate('100ms', style({opacity: 0}))
        ])
      ]),
      // TODO: opacity is not good enough. When hidden, button should also be disabled and aria-hidden (or removed completely)
      state('1', style({opacity: '*'})),
      state('0', style({opacity: '0'})),
      transition('1<=>0', animate(200)),
    ]),
    trigger('searchExpand', [
      state('1', style({width: '*', backgroundColor: '*', margin: '*'})),
      state('0', style({width: '60px', backgroundColor: 'transparent', color: 'white', margin: '0'})),
      transition('0=>1', [
        group([
          style({width: '60px', backgroundColor: 'transparent'}),
          animate(200, style({width: '*', backgroundColor: '*', color: '*'})),
          query('@inputExpand', [
            style({width: '0'}),
            animate(200, style({
              width: '*',
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
          style({width: '*'}),
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
              width: '0',
              backgroundColor: 'transparent',
              opacity: '0',
              margin: '0',
            }))
          ]),
        ])
      ]),
    ]),
    trigger('inputExpand', [
      state('0', style({width: '0', margin: '0'})),
      // Without this transition, the input animates to an incorrect width
      transition('0=>1', []),
    ]),
  ],
})
export class HeaderPanelComponent implements OnInit {

  @ViewChildren('checkboxes') checkboxes: QueryList<ElementRef>;
  @ViewChild(DefaultValueAccessor)
  inputModel: DefaultValueAccessor;

  Header_Buttons = HEADER_BUTTONS;

  viewItems: string[] = Object.values(VIEW_LIST);
  viewItemModel: string[] = [];

  _value = '';
  expanded = false;

  constructor(public applicationService: ApplicationService) { }

  ngOnInit(): void {

  }

  onSituationPicture = () => {
    if (this.applicationService.selectedHeaderPanelButton === HEADER_BUTTONS.situationPictures) {
      // this.applicationService.selectedHeaderPanelButton = HEADER_BUTTONS.none;
    } else {
      this.applicationService.selectedHeaderPanelButton = HEADER_BUTTONS.situationPictures;
      // open panel
      this.applicationService.screen.showLeftPanel = true;
      this.applicationService.screen.showSituationPicture = true;
      //close others
      this.applicationService.screen.showMissionControl = false;
      this.applicationService.screen.showVideo = false;

    }
  };

  onMissionControl = () => {
    if (this.applicationService.selectedHeaderPanelButton === HEADER_BUTTONS.missionControl) {
      // this.applicationService.selectedHeaderPanelButton = HEADER_BUTTONS.none;
    } else {
      this.applicationService.selectedHeaderPanelButton = HEADER_BUTTONS.missionControl;
      // open panel
      this.applicationService.screen.showLeftPanel = true;
      this.applicationService.screen.showMissionControl = true;
      //close others
      this.applicationService.screen.showSituationPicture = false;
      this.applicationService.screen.showVideo = false;

    }
  };

  onLiveVideo = () => {
    if (this.applicationService.selectedAirVehicle) {
      if (this.applicationService.selectedHeaderPanelButton === HEADER_BUTTONS.liveVideo) {
        // this.applicationService.selectedHeaderPanelButton = HEADER_BUTTONS.none;
      } else {
        this.applicationService.selectedHeaderPanelButton = HEADER_BUTTONS.liveVideo;
        // open panel
        // TODO: open video
        this.applicationService.screen.showVideo = true;
        this.applicationService.selectedWindow = VIDEO_OR_MAP.map;
        //close others
        this.applicationService.screen.showLeftPanel = false;
        this.applicationService.screen.showMissionControl = false;
        this.applicationService.screen.showSituationPicture = false;
      }
    }
  };

  onMedia = () => {
    if (this.applicationService.selectedHeaderPanelButton === HEADER_BUTTONS.media) {
      this.applicationService.selectedHeaderPanelButton = HEADER_BUTTONS.none;
    } else {
      this.applicationService.selectedHeaderPanelButton = HEADER_BUTTONS.media;
    }
  };

  onToolbox = () => {
    if (this.applicationService.selectedHeaderPanelButton === HEADER_BUTTONS.toolbox) {
      this.applicationService.selectedHeaderPanelButton = HEADER_BUTTONS.none;
    } else {
      this.applicationService.selectedHeaderPanelButton = HEADER_BUTTONS.toolbox;
    }
  };

  onView = () => {
    if (this.applicationService.selectedHeaderPanelButton === HEADER_BUTTONS.view) {
      this.applicationService.selectedHeaderPanelButton = HEADER_BUTTONS.none;
    } else {
      this.applicationService.selectedHeaderPanelButton = HEADER_BUTTONS.view;
    }
  };

  onChangeCheckbox = (event, item: string) => {
    if (!event.checked) {
      const selectedIndex = this.viewItemModel.findIndex(data => data === item);
      if (selectedIndex === -1 && event) {
        this.viewItemModel.push(item);
        if (item === VIEW_LIST.groundResourcesPanel) {
          this.applicationService.screen.showGrandResources = false;
        } else if (item === VIEW_LIST.airResourcesPanel) {
          this.applicationService.screen.showAirResources = false;
        }
      }

    } else {
      const selectedIndex = this.viewItemModel.findIndex(data => data === item);
      if (selectedIndex !== -1) {
        this.viewItemModel.splice(selectedIndex, 1);
        if (item === VIEW_LIST.groundResourcesPanel) {
          this.applicationService.screen.showGrandResources = true;
        } else if (item === VIEW_LIST.airResourcesPanel) {
          this.applicationService.screen.showAirResources = true;
        }
      }
    }
  //   TODO: this.viewItemModel show or hide

  };


  // Search bar
  close = () => {
    this._value = '';
  };

  onSearchClicked = () => {
    if (!this.expanded) {
      this.expanded = true;
    } else {
      console.log('search');
    }
  };

  onBlur = () => {
    if (!(this._value && this._value.length > 0)) {
      this.expanded = false;
    }
  }



}
