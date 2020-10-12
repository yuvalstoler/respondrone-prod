import {Component, OnInit, ViewChild} from '@angular/core';
import {ApplicationService} from '../../../../services/applicationService/application.service';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmDialogComponent} from '../../../../dialogs/confirm-dialog/confirm-dialog.component';
import {ReportsSituationTableComponent} from './reports-situation-table/reports-situation-table.component';
import {LEFT_PANEL_ICON} from '../../../../../types';
import {ReportService} from '../../../../services/reportService/report.service';
import {EventService} from '../../../../services/eventService/event.service';

@Component({
  selector: 'app-reports-situation-picture',
  templateUrl: './reports-situation-picture.component.html',
  styleUrls: ['./reports-situation-picture.component.scss']
})
export class ReportsSituationPictureComponent implements OnInit {

  @ViewChild(ReportsSituationTableComponent ) childComponent: ReportsSituationTableComponent ;
  LEFT_PANEL_ICON =  LEFT_PANEL_ICON;

  constructor(public applicationService: ApplicationService,
              public reportService: ReportService,
              public eventService: EventService,
              public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  onCreateNewReport = () => {
    this.applicationService.selectedReport = undefined;
    this.openReportPanel();
  };

  onDeleteReport = () => {
  //   todo: add confirmWindow
    this.openConfirmDialog(this.applicationService.selectedReport);
  };

  onEditReport = () => {
  //   todo: open editReport leftNarrowPanel
   this.openReportPanel();
  };

  private openReportPanel = () => {
    this.applicationService.screen.showLeftPanel = false;
    this.applicationService.screen.showLeftNarrowPanel = true;
    this.applicationService.screen.showEventPanel = false;
    this.applicationService.screen.showReportPanel = true;
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
        if (this.applicationService.selectedReport) {
          // TODO
          this.eventService.unlinkEventsFromReport(this.applicationService.selectedReport.eventIds, this.applicationService.selectedReport.id);
          this.reportService.deleteReport({id: this.applicationService.selectedReport.id});
        }
      }
    });
  };

  getFilter = (event) => {
    this.childComponent.applyFilter(event);
  };

}
