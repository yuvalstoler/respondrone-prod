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
              private missionService: MissionService,
              private frService: FRService,
              private airVehicleService: AirVehicleService,
              ) {
    this.stateGroups = _.cloneDeep(this.defaultState);
    // this.getAllGroups();
  }

  getAllGroups = () => {
    const events = this.eventService.events.data;
    const reports = this.reportService.reports.data;
    const tasks = this.tasksService.tasks.data;
    const missions = this.missionService.missions.data;
    const frs = this.frService.frs.data;
    const avs = this.airVehicleService.airVehicles.data;
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
        this.eventService.goToEvent(element.id);
        break;
      }
      case ALL_STATES.reports : {
        this.reportService.goToReport(element.id);
        break;
      }
      case ALL_STATES.tasks : {
        // TODO: add goTo function
        // this.tasksService.tasks.goToTask(element.id);
        break;
      }
      case ALL_STATES.missions : {
        // TODO: add goTo function
        // this.missionService.goToMission(element.id);
        break;
      }
      case ALL_STATES.frs : {
        // TODO: add goTo function
        // this.frService.goToFrs(element.id);
        break;
      }
      case ALL_STATES.avs : {
        // TODO: add goTo function
        // this.airVehicleService.goToAVs(element.id);
        break;
      }
    }
  };
}
