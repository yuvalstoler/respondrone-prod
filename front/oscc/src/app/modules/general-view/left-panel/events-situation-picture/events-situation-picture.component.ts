import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {ApplicationService} from 'src/app/services/applicationService/application.service';
import {LEFT_PANEL_ICON} from '../../../../../types';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmDialogComponent} from '../../../../dialogs/confirm-dialog/confirm-dialog.component';
import {EventsSituationTableComponent} from './events-situation-table/events-situation-table.component';
import {EventService} from '../../../../services/eventService/event.service';
import {ReportService} from '../../../../services/reportService/report.service';
import {EVENT_DATA_UI} from '../../../../../../../../classes/typings/all.typings';
import {EventDialogComponent} from '../../../../dialogs/event-dialog/event-dialog.component';

@Component({
  selector: 'app-events-situation-picture',
  templateUrl: './events-situation-picture.component.html',
  styleUrls: ['./events-situation-picture.component.scss']
})
export class EventsSituationPictureComponent implements OnInit {

  @ViewChild(EventsSituationTableComponent) childComponent: EventsSituationTableComponent;
  @ViewChild('inputSearch') inputSearch;
  @Input() screenWidth: number;
  LEFT_PANEL_ICON = LEFT_PANEL_ICON;


  constructor(public applicationService: ApplicationService,
              public eventService: EventService,
              public reportService: ReportService,
              public dialog: MatDialog) {

  }

  ngOnInit(): void {
  }

  onCreateNewEvent = () => {
    this.childComponent.resetTable();
    const title = 'Create new event';
    this.openEventPanel(title);
  };

  onDeleteEvent = () => {
    this.openConfirmDialog();
  };

  onEditEvent = () => {
    const title = 'Edit event';
    this.openEventPanel(title);
  };

  private openEventPanel = (title: string) => {
    const dialogRef = this.dialog.open(EventDialogComponent, {
      maxWidth: '90%',
      disableClose: true,
      data: {title: title}
    });
    this.applicationService.isDialogOpen = true;
    dialogRef.afterClosed().subscribe((result: EVENT_DATA_UI) => {
      if (result) {
        this.eventService.createEvent(result, (event: EVENT_DATA_UI) => {
          this.reportService.linkReportsToEvent(event.reportIds, event.id);
        });
        // console.log(result);
      }
    });
  };

  onArchiveEvent = () => {
    //  todo: move it to the archive folder
  };

  openConfirmDialog = (): void => {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      // minWidth: '250px',
      width: '35em',
      disableClose: true,
      data: ' you want to permanently delete the selected event'
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const selectedEvents: EVENT_DATA_UI[] = this.childComponent.getSelectedEvents();
        selectedEvents.forEach((eventData: EVENT_DATA_UI, index: number) => {
          setTimeout(() => {
            this.reportService.unlinkReportsFromEvent(eventData.reportIds, eventData.id);
            this.eventService.deleteEvent({id: eventData.id});
          }, index * 500);
        });

        this.childComponent.resetTable();
      }
    });
  };

  getFilter = (event: Event) => {
    this.childComponent.applyFilter(event);
  };

  clearPanel = () => {
    this.inputSearch.nativeElement.value = ' ';
    this.childComponent.clearFilter();
  };
}

