import { Component, OnInit } from '@angular/core';
import {ContextMenuService} from '../../services/contextMenuService/context-menu.service';
import {AV_DATA_UI, MISSION_MODEL_UI, MISSION_TYPE, POINT} from '../../../../../../classes/typings/all.typings';
import {MissionDialogComponent} from '../mission-dialog/mission-dialog.component';
import {ApplicationService} from '../../services/applicationService/application.service';
import {HEADER_BUTTONS} from '../../../types';
import {MatDialog} from '@angular/material/dialog';
import {MissionRequestService} from '../../services/missionRequestService/missionRequest.service';
import {LiveVideoService} from '../../services/liveVideoService/live-video.service';

@Component({
  selector: 'app-context-menu',
  templateUrl: './context-menu.component.html',
  styleUrls: ['./context-menu.component.scss']
})
export class ContextMenuComponent implements OnInit {

  constructor(public contextMenuService: ContextMenuService,
              public applicationService: ApplicationService) { }

  ngOnInit(): void {
  }

}
