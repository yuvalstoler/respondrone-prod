import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {SelectionModel} from '@angular/cdk/collections';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {LEFT_PANEL_ICON, MAP} from '../../../../../../types';
import {ApplicationService} from '../../../../../services/applicationService/application.service';

export interface EventsSituation {
  id: string;
  eventTitle: string;
  source: string;
  priority: string;
  type: string;
  description: string;
  time: number;
  createdBy: string;
  message: string;
  link: string;
  map: string;
  descriptionAll: string;
  comments: Array<{ source: string, time: number, text: string }>;
  linkedreports: Array<{ ID: number, Type: string, Description: string, Time: number }>;
}

const ELEMENT_DATA: EventsSituation[] = [
  {
    id: '1000', eventTitle: 'Road 345 block', source: 'FF133', priority: 'warning', type: 'type',
    description: '1', time: 10, createdBy: 'John Blake', message: 'message', link: 'link', map: 'map',
    descriptionAll: 'descriptionAlldescriptionAlldescriptionAlldescriptionAll1000',
    comments: [
      {source: 'FF33', time: 12546324562, text: 'We arrived to the building, the situation is under control'},
      {source: 'OS23', time: 12546324577, text: 'We arrived to the building, the situation is under control'},
      {source: 'DD53', time: 12546324582, text: 'We arrived to the building, the situation is under control'}
    ],
    linkedreports: [
      {ID: 1111, Description: 'Description', Time: 1221321423, Type: 'Fire Alarm'},
      {ID: 2222, Description: 'Description', Time: 1221344423, Type: 'Fire Alarm'},
      {ID: 3333, Description: 'Description', Time: 1221333423, Type: 'Road Block'},
      {ID: 4444, Description: 'Description', Time: 1221352423, Type: 'Fire Alarm'},
      {ID: 5555, Description: 'Description', Time: 1221324423, Type: 'Road Block'}
    ]
  },
  {
    id: '1001', eventTitle: 'Road 345 block', source: 'PP133', priority: 'warning', type: 'type',
    description: '1', time: 10, createdBy: 'John Blake', message: 'message', link: 'link', map: 'map',
    descriptionAll: 'descriptionAlldescriptionAlldescriptionAlldescriptionAll1001',
    comments: [
      {source: 'AA33', time: 12546324562, text: 'We arrived to the building, the situation is under control'},
      {source: 'SS23', time: 12546324577, text: 'We arrived to the building, the situation is under control'},
      {source: 'BB53', time: 12546324582, text: 'We arrived to the building, the situation is under control'}
    ],
    linkedreports: [
      {ID: 1111, Description: 'Description', Time: 1221321423, Type: 'Fire Alarm'},
      {ID: 2222, Description: 'Description', Time: 1221344423, Type: 'Fire Alarm'},
      {ID: 3333, Description: 'Description', Time: 1221333423, Type: 'Road Block'},
      {ID: 4444, Description: 'Description', Time: 1221352423, Type: 'Fire Alarm'},
      {ID: 5555, Description: 'Description', Time: 1221324423, Type: 'Road Block'}
    ]
  },
  {
    id: '1002', eventTitle: 'Road 345 block', source: 'ER133', priority: 'warning', type: 'type',
    description: '1', time: 10, createdBy: 'John Blake', message: 'message', link: 'link', map: 'map',
    descriptionAll: 'descriptionAlldescriptionAlldescriptionAlldescriptionAll1002',
    comments: [
      {source: 'SS33', time: 12546324562, text: 'We arrived to the building, the situation is under control'},
      {source: 'GGS23', time: 12546324577, text: 'We arrived to the building, the situation is under control'},
      {source: 'VV53', time: 12546324582, text: 'We arrived to the building, the situation is under control'}
    ],
    linkedreports: [
      {ID: 1111, Description: 'Description', Time: 1221321423, Type: 'Fire Alarm'},
      {ID: 2222, Description: 'Description', Time: 1221344423, Type: 'Fire Alarm'},
      {ID: 3333, Description: 'Description', Time: 1221333423, Type: 'Road Block'},
      {ID: 4444, Description: 'Description', Time: 1221352423, Type: 'Fire Alarm'},
      {ID: 5555, Description: 'Description', Time: 1221324423, Type: 'Road Block'}
    ]
  }];

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

  displayedColumns: string[] = ['select', 'id', 'eventTitle', 'source', 'priority', 'type', 'description', 'time', 'createdBy',
    'message', 'link', 'map'];
  displayedColumnsMinimize: string[] = ['id', 'priority', 'type'];
  dataSource = new MatTableDataSource</*EventsSituation*/ any>(ELEMENT_DATA);

  expandedElement: MAP</*EventsSituation*/ any> = {};
  selection = new SelectionModel<EventsSituation>(true, []);
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  LEFT_PANEL_ICON = LEFT_PANEL_ICON;

  constructor(private applicationService: ApplicationService) {
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
  checkboxLabel = (row?: EventsSituation): string => {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  };

  onChangeAllSelected = (event) => {
    if (event.checked) {
      this.dataSource.data.forEach((row: EventsSituation) => {
        this.expandedElement[row.id] = this.expandedElement[row.id] || {};
        this.expandedElement[row.id] = row;
      });
    } else {
      this.dataSource.data.forEach((row: EventsSituation) => {
        this.expandedElement[row.id] = {};
      });
    }
    return event ? this.masterToggle() : null;
  };

  onChangeCheckbox = (event, row: EventsSituation) => {
    if (event.checked) {
      this.expandedElement[row.id] = this.expandedElement[row.id] || {};
      this.expandedElement[row.id] = row;
      this.applicationService.selectedEvent = row;
    } else {
      this.expandedElement[row.id] = {};
      this.applicationService.selectedEvent = undefined;
    }
    return event ? this.selection.toggle(row) : null;
  }


}

