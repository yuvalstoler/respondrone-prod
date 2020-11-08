import { Component, OnInit } from '@angular/core';
import {ReportDialogComponent} from "../../../../dialogs/report-dialog/report-dialog.component";
import {REPORT_DATA_UI} from "../../../../../../../../classes/typings/all.typings";
import {MatDialog} from "@angular/material/dialog";
import {MissionDialogComponent} from "../../../../dialogs/mission-dialog/mission-dialog.component";
import {ApplicationService} from "../../../../services/applicationService/application.service";
import {LEFT_PANEL_ICON} from "../../../../../types";

@Component({
  selector: 'app-missions-mission-control',
  templateUrl: './missions-mission-control.component.html',
  styleUrls: ['./missions-mission-control.component.scss']
})
export class MissionsMissionControlComponent implements OnInit {

  LEFT_PANEL_ICON = LEFT_PANEL_ICON;

  constructor( public dialog: MatDialog,
               public applicationService: ApplicationService) { }

  ngOnInit(): void {
  }

  onCreateNewMission = () => {
    this.openPanel('Create new mission request');
  }

  private openPanel = (title: string) => {
    const dialogRef = this.dialog.open(MissionDialogComponent, {
      width: '45vw',
      disableClose: true,
      data: {title: title}
    });

    dialogRef.afterClosed().subscribe((result: REPORT_DATA_UI) => {
      if (result) {
      }
    });
  };

}
