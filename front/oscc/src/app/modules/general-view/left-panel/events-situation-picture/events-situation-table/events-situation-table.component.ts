import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {SelectionModel} from '@angular/cdk/collections';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {LEFT_PANEL_ICON, MAP} from '../../../../../../types';
import {ApplicationService} from '../../../../../services/applicationService/application.service';
import {EVENT_DATA_UI} from '../../../../../../../../../classes/typings/all.typings';
import {EventService} from '../../../../../services/eventService/event.service';



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

export class EventsSituationTableComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['select', 'id', 'title', 'source', 'priority', 'type', 'description', 'time', 'createdBy', 'message', 'link', 'map'];
  displayedColumnsMinimize: string[] = ['id', 'priority', 'type'];
  dataSource = new MatTableDataSource<EVENT_DATA_UI>();

  expandedElement: MAP<EVENT_DATA_UI> = {};
  selection = new SelectionModel<EVENT_DATA_UI>(true, []);
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  LEFT_PANEL_ICON = LEFT_PANEL_ICON;

  constructor(public applicationService: ApplicationService,
              public eventService: EventService) {

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
  }

  private selectRow = (element): void => {
    if (this.applicationService.selectedEvent === undefined) {
      this.applicationService.selectedEvent = element;
    } else {
      this.applicationService.selectedEvent = undefined;
    }
    // this.expandedElement = this.expandedElement === element ? null : element;
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


  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected = () => {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  };

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle = () => {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => {
          this.selection.select(row);
        }
      );
  };

  /** The label for the checkbox on the passed row */
  checkboxLabel = (row?: EVENT_DATA_UI): string => {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  };

  onChangeAllSelected = (event) => {
    if (event.checked) {
      this.dataSource.data.forEach((row: EVENT_DATA_UI) => {
        this.expandedElement[row.id] = row;
      });
    } else {
      this.dataSource.data.forEach((row: EVENT_DATA_UI) => {
        delete this.expandedElement[row.id];
      });
    }
    return event ? this.masterToggle() : null;
  };

  onChangeCheckbox = (event, row: EVENT_DATA_UI) => {
    if (event.checked) {
      this.expandedElement[row.id] = row;
      this.applicationService.selectedEvent = row;
    } else {
      delete this.expandedElement[row.id];
      this.applicationService.selectedEvent = undefined;
    }
    return event ? this.selection.toggle(row) : null;
  }


}

