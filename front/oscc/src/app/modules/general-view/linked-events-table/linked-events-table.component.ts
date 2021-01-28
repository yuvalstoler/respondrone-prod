import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {MatDialog} from '@angular/material/dialog';
import {MatTableDataSource} from '@angular/material/table';
import {LinkedEventDialogComponent} from '../../../dialogs/linked-event-dialog/linked-event-dialog.component';
import {LINKED_EVENT_DATA, LINKED_REPORT_DATA, REPORT_DATA_UI} from '../../../../../../../classes/typings/all.typings';
import {EventService} from '../../../services/eventService/event.service';
import {ApplicationService} from '../../../services/applicationService/application.service';

@Component({
  selector: 'app-linked-events-table',
  templateUrl: './linked-events-table.component.html',
  styleUrls: ['./linked-events-table.component.scss']
})
export class LinkedEventsTableComponent implements OnInit, AfterViewInit {

  @Input() element: REPORT_DATA_UI;
  @Input() isAllColumns: boolean;
  @Output() updateLinkedEvents = new EventEmitter<string[]>();
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  displayedColumns: string[] = ['ID', 'Type', 'Description', 'Time', 'actionsColumn'];
  dataSource = new MatTableDataSource<LINKED_EVENT_DATA>();

  constructor(public dialog: MatDialog,
              public eventService: EventService,
              public applicationService: ApplicationService) {
  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.element.events);
  }


  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  selectRow = (row) => {

  };

  onLinked = (row: LINKED_EVENT_DATA) => {
    const event = this.eventService.getEventById(row.id);
    this.eventService.flyToObject(event);
    this.eventService.goToEvent(row.id);
  }

  removeAll() {
    this.dataSource.data = [];
  }

  removeAt = (row: LINKED_EVENT_DATA) => {
    const eventIds = [...this.element.eventIds];
    const index = eventIds.indexOf(row.id);
    if (index !== -1) {
      eventIds.splice(index, 1);
    }
    this.updateLinkedEvents.emit(eventIds);
  };

  onNewEvent = () => {

  };

  onAddEvent = (event) => {
    event.stopPropagation();
    if (this.eventService.events.data.length > 0) {
      this.openAddLinkedEventDialog();
    }
  };

  openAddLinkedEventDialog = (): void => {
    const dialogRef = this.dialog.open(LinkedEventDialogComponent, {
      maxWidth: '90%',
      disableClose: true,
      data: this.element.eventIds
    });

    dialogRef.afterClosed().subscribe((result: string[]) => {
      if (result && Array.isArray(result)) {
        const allLinked = [...this.element.eventIds, ...result];
        this.updateLinkedEvents.emit(allLinked);
      }
    });
  };

}
