import { Component, OnInit } from '@angular/core';
import {ApplicationService} from '../../../../services/applicationService/application.service';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmDialogComponent} from '../../../../dialogs/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-reports-situation-picture',
  templateUrl: './reports-situation-picture.component.html',
  styleUrls: ['./reports-situation-picture.component.scss']
})
export class ReportsSituationPictureComponent implements OnInit {

  constructor(public applicationService: ApplicationService,
              public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  onCreateNewReport = () => {
    this.applicationService.screen.showLeftPanel = false;
    this.applicationService.screen.showLeftNarrowPanel = true;
    this.applicationService.screen.showEventPanel = false;
    this.applicationService.screen.showReportPanel = true;

  };

  onDeleteReport = () => {
  //   todo: add confirmWindow
    this.openConfirmDialog(this.applicationService.selectedReport);
  };

  onEditReport = () => {
  //   todo: open editReport leftNarrowPanel
  };

  onArchiveReport = () => {
  //  todo: move it to the archive folder
  };

  openConfirmDialog = (data): void => {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      minWidth: '250px',
      disableClose: true,
      data: ' you want to permanently delete the selected report'
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
      // todo:  delete data
      }
    });
  };

}
