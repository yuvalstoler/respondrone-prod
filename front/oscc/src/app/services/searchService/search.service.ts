import { Injectable } from '@angular/core';
import {StateGroup} from '../../modules/general-view/search-panel/search-panel.component';
import {EventService} from '../eventService/event.service';
import {ReportService} from '../reportService/report.service';
import {TasksService} from '../tasksService/tasks.service';
import {FRService} from '../frService/fr.service';
import {MissionService} from '../missionService/mission.service';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  stateGroups: StateGroup[] =
    [
      {
        letter: 'A',
        names: ['Alabama', 'Alaska', 'Arizona', 'Arkansas']
      },
      {
        letter: 'C',
        names: ['California', 'Colorado', 'Connecticut']
      },
      {
        letter: 'D',
        names: ['Delaware']
      },
      {
        letter: 'F',
        names: ['Florida']
      },
      {
        letter: 'G',
        names: ['Georgia']
      },
      {
        letter: 'H',
        names: ['Hawaii']
      },
      {
        letter: 'I',
        names: ['Idaho', 'Illinois', 'Indiana', 'Iowa']
      },
      {
        letter: 'K',
        names: ['Kansas', 'Kentucky']
      }, {
      letter: 'L',
      names: ['Louisiana']
    }, {
      letter: 'M',
      names: ['Maine', 'Maryland', 'Massachusetts', 'Michigan',
        'Minnesota', 'Mississippi', 'Missouri', 'Montana']
    }, {
      letter: 'N',
      names: ['Nebraska', 'Nevada', 'New Hampshire', 'New Jersey',
        'New Mexico', 'New York', 'North Carolina', 'North Dakota']
    }, {
      letter: 'O',
      names: ['Ohio', 'Oklahoma', 'Oregon']
    }, {
      letter: 'P',
      names: ['Pennsylvania']
    }, {
      letter: 'R',
      names: ['Rhode Island']
    }, {
      letter: 'S',
      names: ['South Carolina', 'South Dakota']
    }, {
      letter: 'T',
      names: ['Tennessee', 'Texas']
    }, {
      letter: 'U',
      names: ['Utah']
    }, {
      letter: 'V',
      names: ['Vermont', 'Virginia']
    }, {
      letter: 'W',
      names: ['Washington', 'West Virginia', 'Wisconsin', 'Wyoming']
    }];

  constructor(private eventService: EventService,
              private reportService: ReportService,
              private tasksService: TasksService,
              private missionService: MissionService,
              private frService: FRService
              ) { }
}
