import {Component, OnInit, Input, ViewChild, AfterViewInit, Output, EventEmitter} from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {MatDialog} from '@angular/material/dialog';
import {LinkedReportDialogComponent} from '../../../dialogs/linked-report-dialog/linked-report-dialog.component';
import {EVENT_DATA_UI, LINKED_REPORT_DATA} from '../../../../../../../classes/typings/all.typings';
import {ReportService} from '../../../services/reportService/report.service';

@Component({
  selector: 'app-linked-reports-table',
  templateUrl: './linked-reports-table.component.html',
  styleUrls: ['./linked-reports-table.component.scss']
})
export class LinkedReportsTableComponent implements OnInit, AfterViewInit {

  @Input() element: EVENT_DATA_UI;
  @Output() updateLinkedReports = new EventEmitter<string[]>();
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  displayedColumns: string[] = ['ID', 'Type', 'Description', 'Time', 'actionsColumn'];
  dataSource = new MatTableDataSource<LINKED_REPORT_DATA>();

  constructor( public dialog: MatDialog,
               public reportService: ReportService) {
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

  removeAt = (row: LINKED_REPORT_DATA) => {
    const reportIds = [...this.element.reportIds];
    const index = reportIds.indexOf(row.id);
    if (index !== -1) {
      reportIds.splice(index, 1);
    }
    this.updateLinkedReports.emit(reportIds);
  };

  onAddReport = () => {
    if (this.reportService.reports.data.length > 0) {
      this.openAddLinkedReportDialog();
    }

  };

  openAddLinkedReportDialog = (): void => {
    const dialogRef = this.dialog.open(LinkedReportDialogComponent, {
      width: '500px',
      disableClose: true,
      data: this.element.reportIds
    });

    dialogRef.afterClosed().subscribe((result: string[]) => {
      if (result && Array.isArray(result)) {
        this.updateLinkedReports.emit(result);
      }
    });
  };



}
