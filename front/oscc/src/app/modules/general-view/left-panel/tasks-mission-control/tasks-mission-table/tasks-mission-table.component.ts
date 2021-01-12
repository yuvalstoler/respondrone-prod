import {AfterContentInit, AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {
  COMMENT,
  EVENT_DATA_UI, ID_TYPE,
  TASK_DATA_UI
} from '../../../../../../../../../classes/typings/all.typings';
import {LEFT_PANEL_ICON, MAP} from '../../../../../../types';
import {SelectionModel} from '@angular/cdk/collections';
import {MatSort} from '@angular/material/sort';
import {ApplicationService} from '../../../../../services/applicationService/application.service';
import {TasksService} from '../../../../../services/tasksService/tasks.service';
import {animate, state, style, transition, trigger} from '@angular/animations';
import * as _ from 'lodash';


@Component({
  selector: 'app-tasks-mission-table',
  templateUrl: './tasks-mission-table.component.html',
  styleUrls: ['./tasks-mission-table.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed, void', style({height: '0px', minHeight: '0', display: 'none'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
      transition('expanded <=> void', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
    ]),
  ]
})
export class TasksMissionTableComponent implements OnInit, AfterViewInit, OnDestroy {

  displayedColumns: string[] = ['expandCollapse', 'select', 'id', 'title', 'priority', 'status', 'type', 'description', 'time', 'message', 'assignees', 'map'];
  displayedColumnsMinimize: string[] = ['id', 'priority', 'type'];
  dataSource = new MatTableDataSource<TASK_DATA_UI>();

  expandedElement: MAP<TASK_DATA_UI> = {};
  selection = new SelectionModel<TASK_DATA_UI>(true, []);
  selectedElement: TASK_DATA_UI;
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  panelOpenState: MAP<boolean> = {};
  subscriptions = [];

  LEFT_PANEL_ICON = LEFT_PANEL_ICON;

  constructor(public applicationService: ApplicationService,
              public tasksService: TasksService) {
    const subscription = this.tasksService.tasks$.subscribe((isNewData: boolean) => {
      if (isNewData) {
        this.dataSource.data = this.setDataByDate(this.tasksService.tasks.data);
      }
    });
    this.subscriptions.push(subscription);
  }

  ngOnInit(): void {
    const subscription = this.tasksService.changeSelected$.subscribe((selectedId: ID_TYPE) => {
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

    this.applicationService.selectedTasks.forEach(task => {
      const row = this.dataSource.data.find(obj => obj.id === task.id);
      if (row) {
        this.selection.select(row);
      }
    });
  }

  private setDataByDate = (data: TASK_DATA_UI[]): TASK_DATA_UI[] => {
    const arraySortedByDate: TASK_DATA_UI[] = data.sort((a, b) => (a.time < b.time ? 1 : -1));
    return arraySortedByDate;
  };

  getOpenStateDescription = ($event) => {
    this.panelOpenState = $event;
  };

  private selectRow = (row: TASK_DATA_UI): void => {
    this.selection.clear();
    this.applicationService.selectedTasks = [];
    this.onChangeCheckbox({checked: true}, row);
  };

  private isSortingDisabled = (columnText: string): boolean => {
    let res: boolean = false;
    if (columnText === 'message' || columnText === 'assignees' || columnText === 'map') {
      res = true;
    }
    return res;
  };

  applyFilter = ($event: Event) => {
    const filterValue = ($event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  };

  getSelectedTasks = (): TASK_DATA_UI[] => {
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
      this.applicationService.selectedTasks = [];
    } else {
      this.dataSource.data.forEach(row => {
        this.selection.select(row);

        const selectedIndex = this.applicationService.selectedTasks.findIndex(data => data.id === row.id);
        const task = this.tasksService.getTaskById(row.id);
        if (selectedIndex === -1 && task) {
          this.applicationService.selectedTasks.push(task);
        }
      });
    }
  };

  /** The label for the checkbox on the passed row */
  checkboxLabel = (row?: TASK_DATA_UI): string => {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  };

  onChangeAllSelected = ($event) => {
    return $event ? this.masterToggle() : null;
  };

  onChangeCheckbox = ($event, row: TASK_DATA_UI) => {
    if ($event.checked) {
      const selectedIndex = this.applicationService.selectedTasks.findIndex(data => data.id === row.id);
      const task = this.tasksService.getTaskById(row.id);
      if (selectedIndex === -1 && task) {
        this.applicationService.selectedTasks.push(task);
      }
    } else {
      const selectedIndex = this.applicationService.selectedTasks.findIndex(data => data.id === row.id);
      if (selectedIndex !== -1) {
        this.applicationService.selectedTasks.splice(selectedIndex, 1);
      }
    }
    return $event ? this.selection.toggle(row) : null;
  };

  onExpandCollapse = (event, row: TASK_DATA_UI) => {
    event.stopPropagation();
    this.expandedElement[row.id] = this.expandedElement[row.id] ? undefined : row;
  };

  onChangeComments = (comments: COMMENT[], element: EVENT_DATA_UI) => {
    const event = this.tasksService.getTaskById(element.id);
    if (event) {
      const newEvent = {...event};
      newEvent.comments = comments;
      this.tasksService.createTask(newEvent);
    }
  };

  clickOnIcon = ($event, element: TASK_DATA_UI, column: string) => {
    $event.stopPropagation();
    if (column === 'map') {
      this.tasksService.flyToObject(element);
    } else if (column === 'assignees') {

    }

  };

  onUpdateAssignees = (result: string[], element: TASK_DATA_UI) => {
    if (result && Array.isArray(result)) {
      const task = this.tasksService.getTaskById(element.id);
      if (task) {
        task.assigneeIds = result;
        this.tasksService.createTask(task);
      }
    }
  };

  resetTable = () => {
    this.selection.clear();
    this.applicationService.selectedTasks = [];
  };


  ngOnDestroy() {
    this.resetTable();

    this.tasksService.changeSelected$.next(undefined);
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
  }

}
