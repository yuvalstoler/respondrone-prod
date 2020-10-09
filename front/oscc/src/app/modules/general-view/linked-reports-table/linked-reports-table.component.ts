import {Component, OnInit, Input, ViewChild, AfterViewInit} from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {MatDialog} from '@angular/material/dialog';
import {LinkedReportDialogComponent} from '../../../dialogs/linked-report-dialog/linked-report-dialog.component';
import {EVENT_DATA_UI, LINKED_REPORT_DATA} from '../../../../../../../classes/typings/all.typings';

@Component({
  selector: 'app-linked-reports-table',
  templateUrl: './linked-reports-table.component.html',
  styleUrls: ['./linked-reports-table.component.scss']
})
export class LinkedReportsTableComponent implements OnInit, AfterViewInit {

  @Input() element: EVENT_DATA_UI;
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  displayedColumns: string[] = ['ID', 'Type', 'Description', 'Time', 'actionsColumn'];
  dataSource = new MatTableDataSource<LINKED_REPORT_DATA>();

  constructor( public dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.element.reports);
  }


  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  selectRow = (row) => {

  };

  removeAll() {
    this.dataSource.data = [];
  }

  removeAt = (index: number) => {
    const data = this.dataSource.data;
    data.splice( index, 1);

    this.dataSource.data = data;
  };

  onNewReport = () => {

  };

  onAddReport = () => {
    this.openAddLinkedReportDialog();
  };

  openAddLinkedReportDialog = (): void => {
    const dialogRef = this.dialog.open(LinkedReportDialogComponent, {
      minWidth: '500px',
      disableClose: true,
      data: ' you want to permanently delete the selected report'
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // todo:  data
      }
    });
  };

}
