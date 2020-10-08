import {AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {MatDialog} from '@angular/material/dialog';
import {MatTableDataSource} from '@angular/material/table';
import {LinkedEventDialogComponent} from '../../../dialogs/linked-event-dialog/linked-event-dialog.component';

@Component({
  selector: 'app-linked-events-table',
  templateUrl: './linked-events-table.component.html',
  styleUrls: ['./linked-events-table.component.scss']
})
export class LinkedEventsTableComponent implements OnInit, AfterViewInit {

  @Input() element;
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  displayedColumns: string[] = ['ID', 'Type', 'Description', 'Time', 'actionsColumn'];

  constructor( public dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.element.linkedevents = new MatTableDataSource(this.element.linkedevents);
  }


  ngAfterViewInit() {
    this.element.linkedevents.sort = this.sort;
  }

  selectRow = (row) => {

  };

  removeAll() {
    this.element.linkedevents.data = [];
  }

  removeAt = (index: number) => {
    const data = this.element.linkedevents.data;
    data.splice( index, 1);

    this.element.linkedevents.data = data;
  };

  onNewEvent = () => {

  };

  onAddEvent = () => {
    this.openAddLinkedEventDialog();
  };

  openAddLinkedEventDialog = (): void => {
    const dialogRef = this.dialog.open(LinkedEventDialogComponent, {
      minWidth: '500px',
      disableClose: true,
      data: ''
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // todo:  data
      }
    });
  };

}
