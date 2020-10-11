import {AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {MatDialog} from '@angular/material/dialog';
import {MatTableDataSource} from '@angular/material/table';
import {LinkedEventDialogComponent} from '../../../dialogs/linked-event-dialog/linked-event-dialog.component';
import {LINKED_EVENT_DATA, REPORT_DATA_UI} from '../../../../../../../classes/typings/all.typings';
import {ReportService} from '../../../services/reportService/report.service';

@Component({
  selector: 'app-linked-events-table',
  templateUrl: './linked-events-table.component.html',
  styleUrls: ['./linked-events-table.component.scss']
})
export class LinkedEventsTableComponent implements OnInit, AfterViewInit {

  @Input() element: REPORT_DATA_UI;
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  displayedColumns: string[] = ['ID', 'Type', 'Description', 'Time', 'actionsColumn'];
  dataSource = new MatTableDataSource<LINKED_EVENT_DATA>();

  constructor( public dialog: MatDialog,
               public reportService: ReportService) {
  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.element.events);
  }


  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  selectRow = (row) => {

  };

  removeAll() {
    this.dataSource.data = [];
  }

  removeAt = (row: LINKED_EVENT_DATA) => {
    // const data = this.dataSource.data;
    // data.splice( index, 1);
    // this.dataSource.data = data;
    const report = this.reportService.reports.data.find(data => data.id === this.element.id);
    if (report && row.id) {
      const index = report.eventIds.indexOf(row.id);
      if (index !== -1) {
        report.eventIds.splice(index, 1);
        this.reportService.createReport(report);
      }
    }


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
      if (result && Array.isArray(result)) {
        const report = this.reportService.reports.data.find(data => data.id === this.element.id);
        if (report) {
          report.eventIds = result;
          this.reportService.createReport(report);
        }
      }
    });
  };

}
