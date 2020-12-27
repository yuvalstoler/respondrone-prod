import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {SelectionModel} from '@angular/cdk/collections';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {LEFT_PANEL_ICON, MAP} from '../../../../../../types';
import {ApplicationService} from '../../../../../services/applicationService/application.service';
import {
  COMMENT,
  EVENT_DATA_UI,
  LOCATION_TYPE,
  POINT
} from '../../../../../../../../../classes/typings/all.typings';
import {EventService} from '../../../../../services/eventService/event.service';
import {ReportService} from '../../../../../services/reportService/report.service';
import * as _ from 'lodash';
import {ContextMenuService} from '../../../../../services/contextMenuService/context-menu.service';


@Component({
  selector: 'app-events-situation-table',
  templateUrl: './events-situation-table.component.html',
  styleUrls: ['./events-situation-table.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed, void', style({height: '0px', minHeight: '0', display: 'none'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
      transition('expanded <=> void', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
    ]),
  ]
})

export class EventsSituationTableComponent implements OnInit, AfterViewInit, OnDestroy {

  displayedColumns: string[] = ['expandCollapse', 'select', 'id', 'title', 'priority', 'type', 'description', 'time', 'createdBy', 'message', 'link', 'map'];
  displayedColumnsMinimize: string[] = ['id', 'title', 'priority', 'type'];
  dataSource = new MatTableDataSource<EVENT_DATA_UI>();

  expandedElement: MAP<EVENT_DATA_UI> = {};
  selection = new SelectionModel<EVENT_DATA_UI>(true, []);
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  panelOpenState: MAP<boolean> = {};

  LEFT_PANEL_ICON = LEFT_PANEL_ICON;

  constructor(public applicationService: ApplicationService,
              public eventService: EventService,
              public reportService: ReportService,
              public contextMenuService: ContextMenuService) {

    this.eventService.events$.subscribe((isNewData: boolean) => {
      if (isNewData) {
        this.dataSource.data = [...this.eventService.events.data];
      }
    });
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;

    this.applicationService.selectedEvents.forEach(event => {
      const row = this.dataSource.data.find(obj => obj.id === event.id);
      if (row) {
        this.selection.select(row);
      }
    });
  }

  getOpenStateDescription = ($event) => {
    this.panelOpenState = $event;
  };

  private selectRow = (row: EVENT_DATA_UI): void => {
    this.eventService.unselectEvent(this.eventService.selectedElement);
    this.eventService.selectedElement = this.eventService.selectedElement && this.eventService.selectedElement.id === row.id ? undefined : row;
    this.eventService.selectEvent(this.eventService.selectedElement);
  };

  private isSortingDisabled = (columnText: string): boolean => {
    let res: boolean = false;
    if (columnText === 'message' || columnText === 'link' || columnText === 'map') {
      res = true;
    }
    return res;
  };

  applyFilter = (event: Event) => {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  };

  getSelectedEvents = (): EVENT_DATA_UI[] => {
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
      this.applicationService.selectedEvents = [];
    } else {
      this.dataSource.data.forEach(row => {
        this.selection.select(row);

        const selectedIndex = this.applicationService.selectedEvents.findIndex(data => data.id === row.id);
        const event = this.eventService.getEventById(row.id);
        if (selectedIndex === -1 && event) {
          this.applicationService.selectedEvents.push(event);
        }
      });
    }
  };

  /** The label for the checkbox on the passed row */
  checkboxLabel = (row?: EVENT_DATA_UI): string => {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  };

  onChangeAllSelected = (event) => {
    return event ? this.masterToggle() : null;
  };

  onChangeCheckbox = ($event, row: EVENT_DATA_UI) => {
    if ($event.checked) {
      const selectedIndex = this.applicationService.selectedEvents.findIndex(data => data.id === row.id);
      const event = this.eventService.getEventById(row.id);
      if (selectedIndex === -1 && event) {
        this.applicationService.selectedEvents.push(event);
      }
    } else {
      const selectedIndex = this.applicationService.selectedEvents.findIndex(data => data.id === row.id);
      if (selectedIndex !== -1) {
        this.applicationService.selectedEvents.splice(selectedIndex, 1);
      }
    }
    return $event ? this.selection.toggle(row) : null;
  };

  onExpandCollapse = (row: EVENT_DATA_UI) => {
    event.stopPropagation();
    this.expandedElement[row.id] = this.expandedElement[row.id] ? undefined : row;
  };

  onUpdateLinkedReports = (result: string[], element: EVENT_DATA_UI) => {
    if (result && Array.isArray(result)) {
      const event = this.eventService.getEventById(element.id);
      if (event) {
        const addedReports = _.differenceWith(result, event.reportIds, (o1, o2) => {
          return o1 === o2;
        });
        this.reportService.linkReportsToEvent(addedReports, event.id); // TODO

        const removedReports = _.differenceWith(event.reportIds, result, (o1, o2) => {
          return o1 === o2;
        });
        this.reportService.unlinkReportsFromEvent(removedReports, event.id); // TODO

        event.reportIds = result;
        this.eventService.createEvent(event);
      }
    }
  };

  onChangeComments = (comments: COMMENT[], element: EVENT_DATA_UI) => {
    const event = this.eventService.getEventById(element.id);
    if (event) {
      const newEvent = {...event};
      newEvent.comments = comments;
      this.eventService.createEvent(newEvent);
    }
  };

  clickOnIcon = (event, element: EVENT_DATA_UI, column: string) => {
    event.stopPropagation();
    if (column === 'map') {
      if (element.locationType === LOCATION_TYPE.locationPoint) {
        const coordinates: POINT = [element.location.longitude, element.location.latitude];
        this.eventService.flyToObject(coordinates);
      }
      else if (element.locationType === LOCATION_TYPE.polygon && element.polygon.length > 0) {
        this.eventService.flyToPolygon(element.polygon);
      }
    } else if (column === 'link') {
        const top = event.clientY - 10;
        const left = event.clientX + 20;
        const clickPosition = {x: left, y: top};
        this.contextMenuService.openLinkToMenu(clickPosition, element, 'event');
    }

  };

  getSeparateString = (column) => {
    return column.split(/(?=[A-Z])/).join(' ');
  };

  ngOnDestroy() {
    this.eventService.unselectEvent(this.eventService.selectedElement);
    this.eventService.selectedElement = undefined;
  }
}

