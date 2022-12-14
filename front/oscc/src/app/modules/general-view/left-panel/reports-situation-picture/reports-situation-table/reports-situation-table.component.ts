import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {MatTableDataSource} from '@angular/material/table';
import {SelectionModel} from '@angular/cdk/collections';
import {MatSort} from '@angular/material/sort';
import {LEFT_PANEL_ICON, MAP} from '../../../../../../types';
import {ApplicationService} from '../../../../../services/applicationService/application.service';
import {ReportService} from '../../../../../services/reportService/report.service';
import {
  COMMENT,
  EVENT_DATA_UI,
  FILE_FS_DATA, ID_TYPE,
  REPORT_DATA_UI, TABLE_DATA_MD
} from '../../../../../../../../../classes/typings/all.typings';
import {EventService} from '../../../../../services/eventService/event.service';
import * as _ from 'lodash';
import {ContextMenuService} from '../../../../../services/contextMenuService/context-menu.service';
import {ResponsiveService} from '../../../../../services/responsiveService/responsive.service';



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

export class ReportsSituationTableComponent implements OnInit, AfterViewInit, OnDestroy {

  displayedColumns: string[] = [];
    displayedColumnsMinimize: string[] = ['id', 'priority', 'type'];
  dataSource = new MatTableDataSource<REPORT_DATA_UI>();

  expandedElement: MAP<REPORT_DATA_UI> = {};
  selection = new SelectionModel<REPORT_DATA_UI>(true, []);
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  panelOpenState: {id: string, isOpen: boolean} = {id: '', isOpen: true};
  subscriptions = [];

  LEFT_PANEL_ICON = LEFT_PANEL_ICON;
  screenWidth: number;

  titlesData: MAP<TABLE_DATA_MD> = {
    id : {
      type: 'text',
      data: 'ID'
    },
    time: {
      type: 'text',
      data: 'Modified',
      tooltip: 'Last updated'
    },
    createdBy: {
      type: 'text',
      data: 'Created By'
    },
    message: {
      type: 'matIcon',
      data: 'comment',
      tooltip: 'Comments'
    },
    link: {
      type: 'matIcon',
      data: 'link',
      tooltip: 'Linked reports'
    },
    map: {
      type: 'matIcon',
      data: 'location_on',
      tooltip: 'Report location'
    },
    attachment: {
      type: 'matIcon',
      data: 'attach_file',
      tooltip: 'Media'
    }
  };

  constructor(public applicationService: ApplicationService,
              public reportService: ReportService,
              public eventService: EventService,
              public responsiveService: ResponsiveService,
              public contextMenuService: ContextMenuService) {
    this.responsiveService.screenWidth$.subscribe(res => {
      this.screenWidth = res;
      if (this.screenWidth <= 1200) {
        this.displayedColumns = ['expandCollapse', 'select', 'id', 'priority', 'type', 'description', 'time', 'link', 'map'];
      } else {
        this.displayedColumns = ['expandCollapse', 'select', 'id', 'source', 'priority', 'type', 'description', 'time', 'createdBy', 'message', 'link', 'map', 'attachment'];
      }
    });
    const subscription = this.reportService.reports$.subscribe((isNewData: boolean) => {
      if (isNewData) {
        this.dataSource.data = this.setDataByDate(this.reportService.reports.data);
      }
    });
    this.subscriptions.push(subscription);
  }

  ngOnInit(): void {
    const subscription = this.reportService.changeSelected$.subscribe((selectedId: ID_TYPE) => {
      if (selectedId !== undefined) {
        const row = this.dataSource.data.find(obj => obj.id === selectedId);
        if (row) {
          this.selectRow(row);

          this.expandedElement = {};
          this.expandedElement[row.id] = row;

          const element = document.getElementById(row.id);
          if (element) {
            element.scrollIntoView({behavior: 'smooth', block: 'center', inline : 'center'});
          }
        }
      }
    });
    this.subscriptions.push(subscription);
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;

    this.applicationService.selectedReports.forEach(report => {
      const row = this.dataSource.data.find(obj => obj.id === report.id);
      if (row) {
        this.selection.select(row);
      }
    });
  }

  private setDataByDate = (data: REPORT_DATA_UI[]): REPORT_DATA_UI[] => {
    const arraySortedByDate: REPORT_DATA_UI[] = data.sort((a, b) => (a.time < b.time ? 1 : -1));
    return arraySortedByDate;
  };

  getOpenStateDescription = ($event) => {
    this.panelOpenState = $event;
  };

  private selectRow = (row: REPORT_DATA_UI): void => {
    this.selection.clear();
    this.applicationService.selectedReports = [];
    this.onChangeCheckbox({checked: true}, row);

    // this.changeSelected(row);
  };

  private changeSelected = (row: REPORT_DATA_UI, isToggleSelected = true) => {
    this.reportService.unselectIcon(this.reportService.selectedElement);
    this.reportService.selectedElement = isToggleSelected && this.reportService.selectedElement && this.reportService.selectedElement.id === row.id ? undefined : row;
    this.reportService.selectIcon(this.reportService.selectedElement);
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

  clearFilter = () => {
    this.dataSource.filter = '';
  };

  getSelectedReports = (): REPORT_DATA_UI[] => {
    try {
      return this.selection.selected;
    } catch (e) {
      return [];
    }
  };

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
      const report = this.reportService.getReportById(row.id);
      if (selectedIndex === -1 && report) {
        this.applicationService.selectedReports.push(report);
        this.changeSelected(report);
      }
    } else {
      const selectedIndex = this.applicationService.selectedReports.findIndex(data => data.id === row.id);
      if (selectedIndex !== -1) {
        this.applicationService.selectedReports.splice(selectedIndex, 1);
      }
    }
    return $event ? this.selection.toggle(row) : null;
  };

  onExpandCollapse = (row: REPORT_DATA_UI) => {
    event.stopPropagation();
    this.expandedElement[row.id] = this.expandedElement[row.id] ? undefined : row;
  };

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
  };

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

  onChangeComments = (comments: COMMENT[], element: EVENT_DATA_UI) => {
    const report = this.reportService.getReportById(element.id);
    if (report) {
      const newReport = {...report};
      newReport.comments = comments;
      this.reportService.createReport(newReport);
    }
  };

  clickOnIcon = (event, element: REPORT_DATA_UI, column: string) => {
    event.stopPropagation();
    if (column === 'map') {
      this.changeSelected(element, false);
      this.reportService.flyToObject(element);
    } else if (column === 'link') {
      const top = event.clientY - 10;
      const left = event.clientX + 20;
      const clickPosition = {x: left, y: top};
      this.contextMenuService.openLinkToMenu(clickPosition, element, 'report');
    }
  };

  resetTable = () => {
    this.reportService.unselectIcon(this.reportService.selectedElement);
    this.reportService.selectedElement = undefined;

    this.selection.clear();
    this.applicationService.selectedReports = [];
  };

  ngOnDestroy() {
    this.resetTable();

    this.reportService.changeSelected$.next(undefined);
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
  }
}
