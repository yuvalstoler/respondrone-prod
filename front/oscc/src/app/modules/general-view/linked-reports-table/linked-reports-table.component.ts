import {Component, OnInit, Input, ViewChild, AfterViewInit, Output, EventEmitter} from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {MatDialog} from '@angular/material/dialog';
import {LinkedReportDialogComponent} from '../../../dialogs/linked-report-dialog/linked-report-dialog.component';
import {EVENT_DATA_UI, LINKED_REPORT_DATA} from '../../../../../../../classes/typings/all.typings';
import {ReportService} from '../../../services/reportService/report.service';
import {ApplicationService} from '../../../services/applicationService/application.service';

@Component({
  selector: 'app-linked-reports-table',
  templateUrl: './linked-reports-table.component.html',
  styleUrls: ['./linked-reports-table.component.scss']
})
export class LinkedReportsTableComponent implements OnInit, AfterViewInit {

  @Input() element: EVENT_DATA_UI;
  @Input() isAllColumns: boolean;
  @Output() updateLinkedReports = new EventEmitter<string[]>();
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  displayedColumns: string[] = ['ID', 'Type', 'Description', 'Time', 'actionsColumn'];
  dataSource:  MatTableDataSource<LINKED_REPORT_DATA>;

  constructor( public dialog: MatDialog,
               public reportService: ReportService,
               public applicationService: ApplicationService) {
  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.element.reports);
  }


  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  selectRow = (row) => {

  };

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
      maxWidth: '90%',
      disableClose: true,
      data: this.element.reportIds
    });

    dialogRef.afterClosed().subscribe((result: string[]) => {
      if (result && Array.isArray(result)) {
        const allLinked = [...this.element.reportIds, ...result];
        this.updateLinkedReports.emit(allLinked);
      }
    });
  };



}
