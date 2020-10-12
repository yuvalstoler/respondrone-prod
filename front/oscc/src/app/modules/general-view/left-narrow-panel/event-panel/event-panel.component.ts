import {Component, OnInit} from '@angular/core';
import {ApplicationService} from 'src/app/services/applicationService/application.service';
import {HEADER_BUTTONS} from 'src/types';
import {
  EVENT_DATA_UI,
  EVENT_TYPE, LOCATION_TYPE,
  PRIORITY,
} from '../../../../../../../../classes/typings/all.typings';
import * as _ from 'lodash';
import {EventService} from '../../../../services/eventService/event.service';

@Component({
  selector: 'app-event-panel',
  templateUrl: './event-panel.component.html',
  styleUrls: ['./event-panel.component.scss']
})
export class EventPanelComponent implements OnInit {

  eventModel: EVENT_DATA_UI;
  types = Object.values(EVENT_TYPE);
  priorities = Object.values(PRIORITY);
  locations = ['Add an address', 'Choose a location point', 'Create a polygon'];
  comment = '';

  defaultEvent: EVENT_DATA_UI = {
    createdBy: undefined,
    time: undefined,
    title: '',
    type: this.types[0],
    priority: this.priorities[0],
    description: '',
    locationType: LOCATION_TYPE.none,
    location:  {longitude: undefined, latitude: undefined},
    address: '',
    polygon: [],
    reportIds: [],
    commentIds: [],
    reports: [],
    comments: [],
    modeDefine: undefined
  };

  LOCATION_TYPE = LOCATION_TYPE;

  constructor(public applicationService: ApplicationService,
              public eventService: EventService) {
    this.initEventModel();
  }

  private initEventModel = () => {
    if (this.applicationService.selectedEvent) {
      this.eventModel = _.cloneDeep(this.applicationService.selectedEvent);
    } else {
      this.eventModel = _.cloneDeep(this.defaultEvent);
    }
  };

  onChangeLocation = (location: string) => {
    if (location === 'Add an address') {
      this.eventModel.location = {longitude: undefined, latitude: undefined};
      this.eventModel.polygon = [];
      this.eventModel.locationType = LOCATION_TYPE.address;
    } else if (location === 'Choose a location point') {
      this.eventModel.address = '';
      this.eventModel.polygon = [];
      this.eventModel.locationType = LOCATION_TYPE.locationPoint;
      // TODO: choose from map
    } else if (location === 'Create a polygon') {
      this.eventModel.location = {longitude: undefined, latitude: undefined};
      this.eventModel.address = '';
      this.eventModel.locationType = LOCATION_TYPE.polygon;
      // TODO: choose from map
    }
  };

  ngOnInit(): void {
  }

  onCreateClick = () => {
    this.eventService.createEvent(this.eventModel);
    this.clearPanel();
  };

  onDeleteClick = () => {
    console.log('delete');
    this.clearPanel();
  };

  clearPanel = () => {
    this.applicationService.screen.showLeftNarrowPanel = false;
    this.applicationService.selectedHeaderPanelButton = HEADER_BUTTONS.none;
    this.eventModel = _.cloneDeep(this.defaultEvent);
  };

  onSendComment = () => {
    if (this.comment !== '' && this.comment !== undefined) {
      console.log(this.comment);
    }
  };

}
