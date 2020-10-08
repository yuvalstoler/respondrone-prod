import {Component, OnInit, Input, ViewChild, AfterViewInit} from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {MatDialog} from '@angular/material/dialog';
import {LinkedReportDialogComponent} from '../../../dialogs/linked-report-dialog/linked-report-dialog.component';

@Component({
  selector: 'app-linked-reports-table',
  templateUrl: './linked-reports-table.component.html',
  styleUrls: ['./linked-reports-table.component.scss']
})
export class LinkedReportsTableComponent implements OnInit, AfterViewInit {

  @Input() element;
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  displayedColumns: string[] = ['ID', 'Type', 'Description', 'Time', 'actionsColumn'];
  
  constructor( public dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.element.linkedreports = new MatTableDataSource(this.element.linkedreports);
  }


  ngAfterViewInit() {
    this.element.linkedreports.sort = this.sort;
  }

  selectRow = (row) => {
    
  };

  removeAll() {
    this.element.linkedreports.data = [];
  }

  removeAt = (index: number) => {
    const data = this.element.linkedreports.data;
    data.splice( index, 1);

    this.element.linkedreports.data = data;
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
