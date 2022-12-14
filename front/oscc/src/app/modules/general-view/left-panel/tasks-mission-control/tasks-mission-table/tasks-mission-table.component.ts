import {AfterContentInit, AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {
  COMMENT,
  EVENT_DATA_UI, ID_TYPE, TABLE_DATA_MD,
  TASK_DATA_UI
} from '../../../../../../../../../classes/typings/all.typings';
import {LEFT_PANEL_ICON, MAP} from '../../../../../../types';
import {SelectionModel} from '@angular/cdk/collections';
import {MatSort} from '@angular/material/sort';
import {ApplicationService} from '../../../../../services/applicationService/application.service';
import {TasksService} from '../../../../../services/tasksService/tasks.service';
import {animate, state, style, transition, trigger} from '@angular/animations';
import * as _ from 'lodash';
import {ResponsiveService} from '../../../../../services/responsiveService/responsive.service';


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

  displayedColumns: string[] = [];
    displayedColumnsMinimize: string[] = ['id', 'title', 'status', 'map'];
  dataSource = new MatTableDataSource<TASK_DATA_UI>();

  expandedElement: MAP<TASK_DATA_UI> = {};
  selection = new SelectionModel<TASK_DATA_UI>(true, []);
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
    message: {
      type: 'matIcon',
      data: 'comment',
      tooltip: 'Comments'
    },
    map: {
      type: 'matIcon',
      data: 'location_on',
      tooltip: 'Tasks location'
    },
    assignees: {
      type: 'matIcon',
      data: 'people',
      tooltip: 'Task\'s assignees'
    }
  };

  constructor(public applicationService: ApplicationService,
              public responsiveService: ResponsiveService,
              public tasksService: TasksService) {
    this.responsiveService.screenWidth$.subscribe(res => {
      this.screenWidth = res;
      if (this.screenWidth <= 1200) {
        this.displayedColumns = ['expandCollapse', 'select', 'id', 'title', 'priority', 'status', 'type', 'description', 'time', 'map'];
      } else {
        this.displayedColumns = ['expandCollapse', 'select', 'id', 'title', 'priority', 'status', 'type', 'description', 'time', 'message', 'assignees', 'map'];
      }
    });
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

  private changeSelected = (row: TASK_DATA_UI, isToggleSelected = true) => {
    this.tasksService.unselectIcon(this.tasksService.selectedElement);
    this.tasksService.selectedElement = isToggleSelected && this.tasksService.selectedElement && this.tasksService.selectedElement.id === row.id ? undefined : row;
    this.tasksService.selectIcon(this.tasksService.selectedElement);
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

  clearFilter = () => {
    this.dataSource.filter = '';
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
        this.changeSelected(task);
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
      this.changeSelected(element, false);
      this.tasksService.flyToObject(element);
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
    this.tasksService.unselectIcon(this.tasksService.selectedElement);
    this.tasksService.selectedElement = undefined;

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
