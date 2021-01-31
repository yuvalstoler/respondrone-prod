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
  MISSION_REQUEST_DATA_UI, ID_TYPE, TABLE_DATA_MD
} from '../../../../../../../../../classes/typings/all.typings';
import * as _ from 'lodash';
import {ContextMenuService} from '../../../../../services/contextMenuService/context-menu.service';
import {MissionRequestService} from '../../../../../services/missionRequestService/missionRequest.service';
import {ResponsiveService} from '../../../../../services/responsiveService/responsive.service';



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

  displayedColumns: string[] = [];

  displayedColumnsMinimize: string[] = [ 'id', 'missionStatus', 'missionType', 'createdBy', 'map'];
  dataSource = new MatTableDataSource<MISSION_REQUEST_DATA_UI>();

  expandedElement: MAP<MISSION_REQUEST_DATA_UI> = {};
  selection = new SelectionModel<MISSION_REQUEST_DATA_UI>(true, []);
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  panelOpenState: MAP<boolean> = {};
  subscriptions = [];

  LEFT_PANEL_ICON = LEFT_PANEL_ICON;
  screenWidth: number;

  titlesData: MAP<TABLE_DATA_MD> = {
    id : {
      type: 'text',
      data: 'ID'
    },
    missionStatus: {
      type: 'text',
      data: 'Status'
    },
    missionType: {
      type: 'text',
      data: 'Type'
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
    map: {
      type: 'matIcon',
      data: 'location_on',
      tooltip: 'Mission location'
    },
    time: {
      type: 'text',
      data: 'Modified',
      tooltip: 'Last updated'
    }
  };

  constructor(public applicationService: ApplicationService,
              public missionRequestService: MissionRequestService,
              public responsiveService: ResponsiveService,
              public contextMenuService: ContextMenuService) {

    this.responsiveService.screenWidth$.subscribe(res => {
      this.screenWidth = res;
      if (this.screenWidth <= 1200) {
        this.displayedColumns = ['expandCollapse', 'select', 'id', 'missionStatus', 'missionType', 'description', 'time', 'map'];
      } else {
        this.displayedColumns = ['expandCollapse', 'select', 'id', 'missionStatus', 'missionType', 'description', 'createdBy', 'time', 'message', 'map'];
      }
    });

    const subscription = this.missionRequestService.missionRequests$.subscribe((isNewData: boolean) => {
      if (isNewData) {
        this.dataSource.data = this.setDataByDate(this.missionRequestService.missionRequests.data);
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

  private setDataByDate = (data: MISSION_REQUEST_DATA_UI[]): MISSION_REQUEST_DATA_UI[] => {
    const arraySortedByDate: MISSION_REQUEST_DATA_UI[] = data.sort((a, b) => (a.time < b.time ? 1 : -1));
    return arraySortedByDate;
  };

  getOpenStateDescription = ($event) => {
    this.panelOpenState = $event;
  };

  private selectRow = (row: MISSION_REQUEST_DATA_UI): void => {
    this.selection.clear();
    this.applicationService.selectedMissionRequests = [];
    this.onChangeCheckbox({checked: true}, row);
  };

  private changeSelected = (row: MISSION_REQUEST_DATA_UI, isToggleSelected = true) => {
    this.missionRequestService.unselectIcon(this.missionRequestService.selectedElement);
    this.missionRequestService.selectedElement = isToggleSelected && this.missionRequestService.selectedElement && this.missionRequestService.selectedElement.id === row.id ? undefined : row;
    this.missionRequestService.selectIcon(this.missionRequestService.selectedElement);
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
        this.changeSelected(item);
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
      this.changeSelected(element, false);
      this.missionRequestService.flyToObject(element);
    }
  };

  resetTable = () => {
    this.missionRequestService.unselectIcon(this.missionRequestService.selectedElement);
    this.missionRequestService.selectedElement = undefined;

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
