import { Injectable } from '@angular/core';
import {StateGroup} from '../../modules/general-view/search-panel/search-panel.component';
import {EventService} from '../eventService/event.service';
import {ReportService} from '../reportService/report.service';
import {TasksService} from '../tasksService/tasks.service';
import {FRService} from '../frService/fr.service';
import {MissionService} from '../missionService/mission.service';
import {AirVehicleService} from '../airVehicleService/airVehicle.service';
import * as _ from 'lodash';
import {ALL_STATES} from '../../../types';
import {MissionRequestService} from "../missionRequestService/missionRequest.service";
import {
  AV_DATA_UI,
  EVENT_DATA_UI, FR_DATA_UI,
  MISSION_REQUEST_DATA_UI,
  REPORT_DATA_UI,
  TASK_DATA_UI
} from "../../../../../../classes/typings/all.typings";


@Injectable({
  providedIn: 'root'
})
export class SearchService {

  stateGroups: StateGroup[] = [];

  defaultState: StateGroup[] = [
    {letter: ALL_STATES.events, names: []},
    {letter: ALL_STATES.reports, names: []},
    {letter: ALL_STATES.tasks, names: []},
    {letter: ALL_STATES.missions, names: []},
    {letter: ALL_STATES.frs, names: []},
    {letter: ALL_STATES.avs, names: []}

  ];
    // [
    //   {
    //     letter: 'A',
    //     names: ['Alabama', 'Alaska', 'Arizona', 'Arkansas']
    //   },
    //   {
    //     letter: 'C',
    //     names: ['California', 'Colorado', 'Connecticut']
    //   },
    //   {
    //     letter: 'D',
    //     names: ['Delaware']
    //   },
    //   {
    //     letter: 'F',
    //     names: ['Florida']
    //   },
    //   {
    //     letter: 'G',
    //     names: ['Georgia']
    //   },
    //   {
    //     letter: 'H',
    //     names: ['Hawaii']
    //   },
    //   {
    //     letter: 'I',
    //     names: ['Idaho', 'Illinois', 'Indiana', 'Iowa']
    //   },
    //   {
    //     letter: 'K',
    //     names: ['Kansas', 'Kentucky']
    //   }, {
    //   letter: 'L',
    //   names: ['Louisiana']
    // }, {
    //   letter: 'M',
    //   names: ['Maine', 'Maryland', 'Massachusetts', 'Michigan',
    //     'Minnesota', 'Mississippi', 'Missouri', 'Montana']
    // }, {
    //   letter: 'N',
    //   names: ['Nebraska', 'Nevada', 'New Hampshire', 'New Jersey',
    //     'New Mexico', 'New York', 'North Carolina', 'North Dakota']
    // }, {
    //   letter: 'O',
    //   names: ['Ohio', 'Oklahoma', 'Oregon']
    // }, {
    //   letter: 'P',
    //   names: ['Pennsylvania']
    // }, {
    //   letter: 'R',
    //   names: ['Rhode Island']
    // }, {
    //   letter: 'S',
    //   names: ['South Carolina', 'South Dakota']
    // }, {
    //   letter: 'T',
    //   names: ['Tennessee', 'Texas']
    // }, {
    //   letter: 'U',
    //   names: ['Utah']
    // }, {
    //   letter: 'V',
    //   names: ['Vermont', 'Virginia']
    // }, {
    //   letter: 'W',
    //   names: ['Washington', 'West Virginia', 'Wisconsin', 'Wyoming']
    // }];

  constructor(private eventService: EventService,
              private reportService: ReportService,
              private tasksService: TasksService,
              private missionRequestService: MissionRequestService,
              private frService: FRService,
              private airVehicleService: AirVehicleService,
              ) {
    this.stateGroups = _.cloneDeep(this.defaultState);
    // this.getAllGroups();
  }

  getAllGroups = () => {
    const events: EVENT_DATA_UI[] = this.eventService.events.data;
    const reports: REPORT_DATA_UI[] = this.reportService.reports.data;
    const tasks: TASK_DATA_UI[] = this.tasksService.tasks.data;
    const missions: MISSION_REQUEST_DATA_UI[] = this.missionRequestService.missionRequests.data;
    const frs: FR_DATA_UI[] = this.frService.frs.data;
    const avs: AV_DATA_UI[] = this.airVehicleService.airVehicles.data;
    this.stateGroups.forEach((stateGroup) => {
      switch (stateGroup.letter) {
        case ALL_STATES.events : {
          stateGroup.names = _.cloneDeep(events);
          break;
        }
        case ALL_STATES.reports : {
          stateGroup.names = _.cloneDeep(reports);
          break;
        }
        case ALL_STATES.tasks : {
          stateGroup.names = _.cloneDeep(tasks);
          break;
        }
        case ALL_STATES.missions : {
          stateGroup.names = _.cloneDeep(missions);
          break;
        }
        case ALL_STATES.frs : {
          stateGroup.names = _.cloneDeep(frs);
          break;
        }
        case ALL_STATES.avs : {
          stateGroup.names = _.cloneDeep(avs);
          break;
        }
      }
    });
  };

  goToElement = (label, element) => {

    switch (label) {
      case ALL_STATES.events : {
        this.eventService.flyToObject(element);
        this.eventService.goToEvent(element.id);
        break;
      }
      case ALL_STATES.reports : {
        this.reportService.flyToObject(element);
        this.reportService.goToReport(element.id);
        break;
      }
      case ALL_STATES.tasks : {
        this.tasksService.flyToObject(element);
        this.tasksService.goToTask(element.id);
        break;
      }
      case ALL_STATES.missions : {
        this.missionRequestService.flyToObject(element);
        this.missionRequestService.goToMissionRequest(element.id);
        break;
      }
      case ALL_STATES.frs : {
        this.frService.flyToObject(element);
        this.frService.goToFR(element.id);
        break;
      }
      case ALL_STATES.avs : {
        this.airVehicleService.flyToObject(element);
        this.airVehicleService.goToAV(element.id);
        break;
      }
    }
  };
}
