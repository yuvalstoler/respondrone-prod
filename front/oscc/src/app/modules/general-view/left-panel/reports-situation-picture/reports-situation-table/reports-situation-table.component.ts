import {AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {MatTableDataSource} from '@angular/material/table';
import {SelectionModel} from '@angular/cdk/collections';
import {MatSort} from '@angular/material/sort';
import {LEFT_PANEL_ICON, MAP} from '../../../../../../types';
import {ApplicationService} from '../../../../../services/applicationService/application.service';
import {ReportService} from '../../../../../services/reportService/report.service';
import {FILE_FS_DATA, REPORT_DATA_UI} from '../../../../../../../../../classes/typings/all.typings';
import {EventService} from '../../../../../services/eventService/event.service';
import * as _ from 'lodash';



@Component({
  selector: 'app-reports-situation-table',
  templateUrl: './reports-situation-table.component.html',
  styleUrls: ['./reports-situation-table.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed, void', style({ height: '0px', minHeight: '0', display: 'none' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
      transition('expanded <=> void', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
    ]),
  ]
})

export class ReportsSituationTableComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['select', 'id', 'source', 'priority', 'type', 'description', 'time', 'createdBy', 'message', 'link', 'map', 'attachment'];
  displayedColumnsMinimize: string[] = ['id', 'priority', 'type'];
  dataSource = new MatTableDataSource<REPORT_DATA_UI>();

  expandedElement: MAP<REPORT_DATA_UI> = {};
  selection = new SelectionModel<REPORT_DATA_UI>(true, []);
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  LEFT_PANEL_ICON = LEFT_PANEL_ICON;

  constructor(public applicationService: ApplicationService,
              public reportService: ReportService,
              public eventService: EventService) {

    this.reportService.reports$.subscribe((isNewData: boolean) => {
      if (isNewData) {
        this.dataSource.data = [...this.reportService.reports.data];
      }
    });
  }

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;

    this.applicationService.selectedReports.forEach(report => {
      const row = this.dataSource.data.find(obj => obj.id === report.id);
      if (row) {
        this.selection.select(row);
      }
    });
  }

  private selectRow = (row: REPORT_DATA_UI): void => {
    // if (this.applicationService.selectedReport === undefined) {
    //   this.applicationService.selectedReport = element;
    // } else {
    //   this.applicationService.selectedReport = undefined;
    // }

    // this.expandedElement = this.expandedElement === element ? null : element;

    this.expandedElement[row.id] = this.expandedElement[row.id] ? undefined : row;
  };

  private isSortingDisabled = (columnText: string): boolean => {
    let res: boolean = false;
    if (columnText === 'message' || columnText === 'link' || columnText === 'map' || columnText === 'attachment') {
      res = true;
    }
    return res;
  };

  applyFilter = (event: Event) => {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  };

  getSelectedReports = (): REPORT_DATA_UI[] => {
    try {
      return this.selection.selected;
    } catch (e) {
      return [];
    }
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected = () => {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  };

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle = () => {
    if (this.isAllSelected()) {
      this.selection.clear();
      this.applicationService.selectedReports = [];
    } else {
      this.dataSource.data.forEach(row => {
        this.selection.select(row);

        const selectedIndex = this.applicationService.selectedReports.findIndex(data => data.id === row.id);
        const report = this.reportService.getReportById(row.id);
        if (selectedIndex === -1 && report) {
          this.applicationService.selectedReports.push(report);
        }
      });
    }
  };

  /** The label for the checkbox on the passed row */
  checkboxLabel = (row?: REPORT_DATA_UI): string => {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  };

  onChangeAllSelected = (event) => {
    // if (event.checked) {
    //   this.dataSource.data.forEach((row: REPORT_DATA_UI) => {
    //     this.expandedElement[row.id] = row;
    //   });
    // } else {
    //   this.dataSource.data.forEach((row: REPORT_DATA_UI) => {
    //     delete this.expandedElement[row.id];
    //   });
    // }
    return event ? this.masterToggle() : null;
  };

  onChangeCheckbox = ($event, row: REPORT_DATA_UI) => {
    // if (event.checked) {
    //   this.expandedElement[row.id] = row;
    //   this.applicationService.selectedReport = row;
    // } else {
    //   delete this.expandedElement[row.id];
    //   this.applicationService.selectedReport = undefined;
    // }

    if ($event.checked) {
      const selectedIndex = this.applicationService.selectedReports.findIndex(data => data.id === row.id);
      const event = this.reportService.getReportById(row.id);
      if (selectedIndex === -1 && event) {
        this.applicationService.selectedReports.push(event);
      }
    } else {
      const selectedIndex = this.applicationService.selectedReports.findIndex(data => data.id === row.id);
      if (selectedIndex !== -1) {
        this.applicationService.selectedReports.splice(selectedIndex, 1);
      }
    }
    return $event ? this.selection.toggle(row) : null;
  }

  onUpdateLinkedEvents = (result: string[], element: REPORT_DATA_UI) => {
      if (result && Array.isArray(result)) {
        const report = this.reportService.getReportById(element.id);
        if (report) {

          const addedEvents = _.differenceWith(result, report.eventIds, (o1, o2) => {
            return o1 === o2;
          });
          this.eventService.linkEventsToReport(addedEvents, report.id); // TODO

          const removedEvents = _.differenceWith(report.eventIds, result, (o1, o2) => {
            return o1 === o2;
          });
          this.eventService.unlinkEventsFromReport(removedEvents, report.id); // TODO

          report.eventIds = result;
          this.reportService.createReport(report);
        }
      }
  }

  onAddMedia = (newMedia: FILE_FS_DATA, element: REPORT_DATA_UI) => {
    const report = this.reportService.getReportById(element.id);
    if (report) {
      report.media.unshift(newMedia);
      this.reportService.createReport(report);
    }
  };

  onDeleteMedia = (newMedia: FILE_FS_DATA, element: REPORT_DATA_UI) => {
    const report = this.reportService.getReportById(element.id);
    if (report) {
      const index = report.media.findIndex((data: FILE_FS_DATA) => data.id === newMedia.id);
      if (index !== -1) {
        report.media.splice(index, 1);
      }
      this.reportService.createReport(report);
    }

  };

}
