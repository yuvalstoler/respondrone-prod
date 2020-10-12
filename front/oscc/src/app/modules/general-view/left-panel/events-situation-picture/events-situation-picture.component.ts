import {Component, OnInit, ViewChild} from '@angular/core';
import {ApplicationService} from 'src/app/services/applicationService/application.service';
import {LEFT_PANEL_ICON} from '../../../../../types';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmDialogComponent} from '../../../../dialogs/confirm-dialog/confirm-dialog.component';
import {EventsSituationTableComponent} from './events-situation-table/events-situation-table.component';
import {EventService} from '../../../../services/eventService/event.service';
import {ReportService} from '../../../../services/reportService/report.service';

@Component({
  selector: 'app-events-situation-picture',
  templateUrl: './events-situation-picture.component.html',
  styleUrls: ['./events-situation-picture.component.scss']
})
export class EventsSituationPictureComponent implements OnInit {

  @ViewChild(EventsSituationTableComponent ) childComponent: EventsSituationTableComponent ;
  LEFT_PANEL_ICON =  LEFT_PANEL_ICON;

  constructor(public applicationService: ApplicationService,
              public eventService: EventService,
              public reportService: ReportService,
              public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  onCreateNewEvent = () => {
    this.applicationService.selectedEvent = undefined;
    this.openEventPanel();
  };

  onDeleteEvent = () => {
    //   add confirmWindow
    this.openConfirmDialog(this.applicationService.selectedEvent);
  };

  onEditEvent = () => {
    //  open editEvent leftNarrowPanel
    this.openEventPanel();
  };

  private openEventPanel = () => {
    this.applicationService.screen.showLeftPanel = false;
    this.applicationService.screen.showLeftNarrowPanel = true;
    this.applicationService.screen.showEventPanel = true;
    this.applicationService.screen.showReportPanel = false;
  };

  onArchiveEvent = () => {
    //  todo: move it to the archive folder
  };

  openConfirmDialog = (data): void => {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      minWidth: '250px',
      disableClose: true,
      data: ' you want to permanently delete the selected event'
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (this.applicationService.selectedEvent) {
          // TODO
          this.reportService.unlinkReportsFromEvent(this.applicationService.selectedEvent.reportIds, this.applicationService.selectedEvent.id)
          this.eventService.deleteEvent({id: this.applicationService.selectedEvent.id});
        }
      }
    });
  };

  getFilter = (event) => {
    this.childComponent.applyFilter(event);
  };

}
