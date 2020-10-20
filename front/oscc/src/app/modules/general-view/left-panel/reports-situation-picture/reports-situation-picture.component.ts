import {Component, OnInit, ViewChild} from '@angular/core';
import {ApplicationService} from '../../../../services/applicationService/application.service';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmDialogComponent} from '../../../../dialogs/confirm-dialog/confirm-dialog.component';
import {ReportsSituationTableComponent} from './reports-situation-table/reports-situation-table.component';
import {LEFT_PANEL_ICON} from '../../../../../types';
import {ReportService} from '../../../../services/reportService/report.service';
import {EventService} from '../../../../services/eventService/event.service';
import {REPORT_DATA_UI} from '../../../../../../../../classes/typings/all.typings';
import {EventDialogComponent} from "../../../../dialogs/event-dialog/event-dialog.component";
import {ReportDialogComponent} from "../../../../dialogs/report-dialog/report-dialog.component";

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
    this.applicationService.selectedReports = [];
    this.openReportPanel();
  };

  onDeleteReport = () => {
  //   todo: add confirmWindow
    this.openConfirmDialog();
  };

  onEditReport = () => {
  //   todo: open editReport leftNarrowPanel
   this.openReportPanel();
  };

  private openReportPanel = () => {
    const dialogRef = this.dialog.open(ReportDialogComponent, {
      width: '45vw',
      disableClose: true,
      data: {title: 'Create new report'}
    });

    dialogRef.afterClosed().subscribe((result: string[]) => {
      if (result) {
        console.log(result);
      }
    });
  };

  onArchiveReport = () => {
  //  todo: move it to the archive folder
  };

  openConfirmDialog = (): void => {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      minWidth: '250px',
      disableClose: true,
      data: ' you want to permanently delete the selected report'
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const selectedReports: REPORT_DATA_UI[] = this.childComponent.getSelectedReports();
        selectedReports.forEach((reportData: REPORT_DATA_UI, index: number) => {
          setTimeout(() => {
            this.eventService.unlinkEventsFromReport(reportData.eventIds, reportData.id);
            this.reportService.deleteReport({id: reportData.id});
          }, index * 500);
        });
      }
    });
  };

  getFilter = (event) => {
    this.childComponent.applyFilter(event);
  };

}
