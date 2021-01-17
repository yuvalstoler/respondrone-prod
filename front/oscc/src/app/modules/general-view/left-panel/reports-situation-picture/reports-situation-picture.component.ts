import {Component, OnInit, ViewChild} from '@angular/core';
import {ApplicationService} from '../../../../services/applicationService/application.service';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmDialogComponent} from '../../../../dialogs/confirm-dialog/confirm-dialog.component';
import {ReportsSituationTableComponent} from './reports-situation-table/reports-situation-table.component';
import {LEFT_PANEL_ICON} from '../../../../../types';
import {ReportService} from '../../../../services/reportService/report.service';
import {EventService} from '../../../../services/eventService/event.service';
import {REPORT_DATA_UI} from '../../../../../../../../classes/typings/all.typings';
import {ReportDialogComponent} from '../../../../dialogs/report-dialog/report-dialog.component';
import {MediaService} from '../../../../services/mediaService/media.service';

@Component({
  selector: 'app-reports-situation-picture',
  templateUrl: './reports-situation-picture.component.html',
  styleUrls: ['./reports-situation-picture.component.scss']
})
export class ReportsSituationPictureComponent implements OnInit {

  @ViewChild(ReportsSituationTableComponent ) childComponent: ReportsSituationTableComponent ;
  @ViewChild('inputSearch') inputSearch;
  LEFT_PANEL_ICON =  LEFT_PANEL_ICON;

  constructor(public applicationService: ApplicationService,
              public reportService: ReportService,
              public eventService: EventService,
              public dialog: MatDialog,
              public mediaService: MediaService) { }

  ngOnInit(): void {
  }

  onCreateNewReport = () => {
    this.childComponent.resetTable();
    const title = 'Create new report';
    this.openReportPanel(title);
  };

  onDeleteReport = () => {
    this.openConfirmDialog();
  };

  onEditReport = () => {
    const title = 'Edit report';
   this.openReportPanel(title);
  };

  private openReportPanel = (title) => {
    const dialogRef = this.dialog.open(ReportDialogComponent, {
      width: '45vw',
      disableClose: true,
      data: {title: title}
    });
    this.applicationService.isDialogOpen = true;
    dialogRef.afterClosed().subscribe((result: REPORT_DATA_UI) => {
      if (result) {
        this.reportService.createReport(result, (report: REPORT_DATA_UI) => {
          this.eventService.linkEventsToReport(report.eventIds, report.id);
        });
      }
    });
  };

  onArchiveReport = () => {
  //  todo: move it to the archive folder
  };

  openConfirmDialog = (): void => {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      // minWidth: '250px',
      width: '35em',
      disableClose: true,
      data: ' you want to permanently delete the selected report'
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const selectedReports: REPORT_DATA_UI[] = this.childComponent.getSelectedReports();
        selectedReports.forEach((reportData: REPORT_DATA_UI, index: number) => {
          setTimeout(() => {
            this.eventService.unlinkEventsFromReport(reportData.eventIds, reportData.id);
            reportData.media.forEach((mediaData) => {
              this.mediaService.deleteFile(mediaData);
            });
            this.reportService.deleteReport({id: reportData.id});
          }, index * 500);
        });

        this.childComponent.resetTable();
      }
    });
  };

  getFilter = (event) => {
    this.childComponent.applyFilter(event);
  };

  clearPanel = () => {
    this.inputSearch.nativeElement.value = ' ';
    this.childComponent.clearFilter();
  };
}
