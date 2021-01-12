import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {MatTableDataSource} from '@angular/material/table';
import {SelectionModel} from '@angular/cdk/collections';
import {MatSort} from '@angular/material/sort';
import {LEFT_PANEL_ICON, MAP} from '../../../../../../types';
import {ApplicationService} from '../../../../../services/applicationService/application.service';
import {
  COMMENT,
  EVENT_DATA_UI,
  MISSION_REQUEST_DATA_UI, ID_TYPE
} from '../../../../../../../../../classes/typings/all.typings';
import {EventService} from '../../../../../services/eventService/event.service';
import * as _ from 'lodash';
import {ContextMenuService} from '../../../../../services/contextMenuService/context-menu.service';
import {MissionRequestService} from '../../../../../services/missionRequestService/missionRequest.service';



@Component({
  selector: 'app-missions-table',
  templateUrl: './missions-table.component.html',
  styleUrls: ['./missions-table.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed, void', style({ height: '0px', minHeight: '0', display: 'none' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
      transition('expanded <=> void', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
    ]),
  ]
})

export class MissionsTableComponent implements OnInit, AfterViewInit, OnDestroy {

  displayedColumns: string[] = ['expandCollapse', 'select', 'id', 'missionStatus', 'missionType', 'description', 'createdBy', 'time', 'message', 'map'];

  displayedColumnsMinimize: string[] = [ 'id', 'missionStatus', 'missionType', 'createdBy', 'map'];
  dataSource = new MatTableDataSource<MISSION_REQUEST_DATA_UI>();

  expandedElement: MAP<MISSION_REQUEST_DATA_UI> = {};
  selection = new SelectionModel<MISSION_REQUEST_DATA_UI>(true, []);
  selectedElement: MISSION_REQUEST_DATA_UI;
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  panelOpenState: MAP<boolean> = {};
  subscriptions = [];

  LEFT_PANEL_ICON = LEFT_PANEL_ICON;

  constructor(public applicationService: ApplicationService,
              public missionRequestService: MissionRequestService,
              public eventService: EventService,
              public contextMenuService: ContextMenuService) {

    const subscription = this.missionRequestService.missionRequests$.subscribe((isNewData: boolean) => {
      if (isNewData) {
        this.dataSource.data = [...this.missionRequestService.missionRequests.data];
      }
    });
    this.subscriptions.push(subscription);
  }

  ngOnInit(): void {
    const subscription = this.missionRequestService.changeSelected$.subscribe((selectedMissionRequestId: ID_TYPE) => {
      if (selectedMissionRequestId !== undefined) {
        const row = this.dataSource.data.find(obj => obj.id === selectedMissionRequestId);
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

    this.applicationService.selectedMissionRequests.forEach(report => {
      const row = this.dataSource.data.find(obj => obj.id === report.id);
      if (row) {
        this.selection.select(row);
      }
    });
  }

  getOpenStateDescription = ($event) => {
    this.panelOpenState = $event;
  };

  private selectRow = (row: MISSION_REQUEST_DATA_UI): void => {
    this.selection.clear();
    this.applicationService.selectedMissionRequests = [];
    this.onChangeCheckbox({checked: true}, row);
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

  getSelectedReports = (): MISSION_REQUEST_DATA_UI[] => {
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
    return numSelected >= numRows;
  };

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle = () => {
    if (this.isAllSelected()) {
      this.selection.clear();
      this.applicationService.selectedMissionRequests = [];
    } else {
      this.dataSource.data.forEach(row => {
        this.selection.select(row);

        const selectedIndex = this.applicationService.selectedMissionRequests.findIndex(data => data.id === row.id);
        const item = this.missionRequestService.getById(row.id);
        if (selectedIndex === -1 && item) {
          this.applicationService.selectedMissionRequests.push(item);
        }
      });
    }
  };

  /** The label for the checkbox on the passed row */
  checkboxLabel = (row?: MISSION_REQUEST_DATA_UI): string => {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  };

  onChangeAllSelected = (event) => {
    // if (event.checked) {
    //   this.dataSource.data.forEach((row: MISSION_REQUEST_DATA_UI) => {
    //     this.expandedElement[row.id] = row;
    //   });
    // } else {
    //   this.dataSource.data.forEach((row: MISSION_REQUEST_DATA_UI) => {
    //     delete this.expandedElement[row.id];
    //   });
    // }
    return event ? this.masterToggle() : null;
  };

  onChangeCheckbox = ($event, row: MISSION_REQUEST_DATA_UI) => {
    // if (event.checked) {
    //   this.expandedElement[row.id] = row;
    //   this.applicationService.selectedReport = row;
    // } else {
    //   delete this.expandedElement[row.id];
    //   this.applicationService.selectedReport = undefined;
    // }

    if ($event.checked) {
      const selectedIndex = this.applicationService.selectedMissionRequests.findIndex(data => data.id === row.id);
      const item = this.missionRequestService.getById(row.id);
      if (selectedIndex === -1 && item) {
        this.applicationService.selectedMissionRequests.push(item);
      }
    } else {
      const selectedIndex = this.applicationService.selectedMissionRequests.findIndex(data => data.id === row.id);
      if (selectedIndex !== -1) {
        this.applicationService.selectedMissionRequests.splice(selectedIndex, 1);
      }
    }
    return $event ? this.selection.toggle(row) : null;
  };

  onExpandCollapse = (row: MISSION_REQUEST_DATA_UI) => {
    event.stopPropagation();
    this.expandedElement[row.id] = this.expandedElement[row.id] ? undefined : row;
  };

  onChangeComments = (comments: COMMENT[], element: EVENT_DATA_UI) => {
    const mission = this.missionRequestService.getById(element.id);
    if (mission) {
      const newMission = {...mission};
      newMission.comments = comments;
      this.missionRequestService.updateMissionInDB(newMission);
    }
  };

  clickOnIcon = (event, element: MISSION_REQUEST_DATA_UI, column: string) => {
    event.stopPropagation();
    if (column === 'map') {
      this.missionRequestService.flyToObject(element);
    }
  };

  resetTable = () => {
    this.selection.clear();
    this.applicationService.selectedMissionRequests = [];
  };

  ngOnDestroy() {
    this.resetTable();

    this.missionRequestService.changeSelected$.next(undefined);
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
  }

}
