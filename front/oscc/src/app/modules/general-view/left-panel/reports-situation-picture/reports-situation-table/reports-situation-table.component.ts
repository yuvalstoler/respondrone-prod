import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {MatTableDataSource} from '@angular/material/table';
import {SelectionModel} from '@angular/cdk/collections';
import {MatSort} from '@angular/material/sort';

export interface EventsSituation {
  id: string;
  source: string;
  priority: string;
  type: string;
  description: string;
  time: number;
  createdBy: string;
  message: string;
  link: string;
  map: string;
  attachment: string;

  descriptionAll: string;
  comments: Array<{source: string, time: number, text: string}>;
  linkedreports: Array<{ID: number, Type: string, Description: string, Time: number}>;
  media: Array<any>;
}

const ELEMENT_DATA: EventsSituation[] = [
  {
    id: '1000', source: 'FF133', priority: 'warning', type: 'type',
    description: '1', time: 10, createdBy: 'John Blake', message: 'message', link: 'link', map: 'map',
    attachment: 'attachment',
    descriptionAll: 'descriptionAlldescriptionAlldescriptionAlldescriptionAll1000',
    comments: [
      {source: 'FF33', time: 12546324562, text: 'We arrived to the building, the situation is under control'},
      {source: 'OS23', time: 12546324577, text: 'We arrived to the building, the situation is under control'},
      {source: 'DD53', time: 12546324582, text: 'We arrived to the building, the situation is under control'}
    ],
    linkedreports: [
      {ID: 1111, Description: 'Description4', Time: 1221321423, Type: 'Fire Alarm'},
      {ID: 2222, Description: 'Description3', Time: 1221333423, Type: 'Fire Alarm'},
      {ID: 3333, Description: 'Description1', Time: 1221322423, Type: 'Road Block'},
      {ID: 4444, Description: 'Description2', Time: 1221311423, Type: 'Fire Alarm'},
      {ID: 5555, Description: 'Description5', Time: 1221377423, Type: 'Road Block'}
    ],
    media: [
      {url: 'http://localhost:8100/api/file/1601525743958.jpg', id: '1601525743958.jpg', type: 'image'},
      {url: 'http://localhost:8100/api/file/1601526405336.jpg', id: '1601526405336.jpg', type: 'image'},
      {url: 'http://localhost:8100/api/file/1601526405336.jpg', id: '1601526405336.jpg', type: 'image'},
      {url: 'http://localhost:8100/api/file/1601526405336.jpg', id: '1601526405336.jpg', type: 'image'},
      {url: 'http://localhost:8100/api/file/1601533035168.mp4', id: '1601533035168.mp4', type: 'video'},
    ],
  },
  {
    id: '1001', source: 'PP133', priority: 'warning', type: 'type',
    description: '1', time: 10, createdBy: 'John Blake', message: 'message', link: 'link', map: 'map',
    attachment: 'attachment',
    descriptionAll: 'descriptionAlldescriptionAlldescriptionAlldescriptionAll1001',
    comments: [
      {source: 'AA33', time: 12546324562, text: 'We arrived to the building, the situation is under control'},
      {source: 'SS23', time: 12546324577, text: 'We arrived to the building, the situation is under control'},
      {source: 'BB53', time: 12546324582, text: 'We arrived to the building, the situation is under control'}
    ],
    linkedreports: [
      {ID: 1111, Description: 'Description1', Time: 1221333423, Type: 'Fire Alarm'},
      {ID: 2222, Description: 'Description5', Time: 1221325423, Type: 'Fire Alarm'},
      {ID: 3333, Description: 'Description2', Time: 1221353423, Type: 'Road Block'},
      {ID: 4444, Description: 'Description4', Time: 1221352423, Type: 'Fire Alarm'},
      {ID: 5555, Description: 'Description3', Time: 1221324423, Type: 'Road Block'}
    ],
    media: [
      {url: 'http://localhost:8100/api/file/1601525743958.jpg', id: '1601525743958.jpg', type: 'image'},
      {url: 'http://localhost:8100/api/file/1601526405336.jpg', id: '1601526405336.jpg', type: 'image'},
      {url: 'http://localhost:8100/api/file/1601526405336.jpg', id: '1601526405336.jpg', type: 'image'},
      {url: 'http://localhost:8100/api/file/1601526405336.jpg', id: '1601526405336.jpg', type: 'image'},
      {url: 'http://localhost:8100/api/file/1601533035168.mp4', id: '1601533035168.mp4', type: 'video'},
    ],
  },
  {
    id: '1002', source: 'ER133', priority: 'warning', type: 'type',
    description: '1', time: 10, createdBy: 'John Blake', message: 'message', link: 'link', map: 'map',
    attachment: 'attachment',
    descriptionAll: 'descriptionAlldescriptionAlldescriptionAlldescriptionAll1002',
    comments: [
      {source: 'SS33', time: 12546324562, text: 'We arrived to the building, the situation is under control'},
      {source: 'GGS23', time: 12546324577, text: 'We arrived to the building, the situation is under control'},
      {source: 'VV53', time: 12546324582, text: 'We arrived to the building, the situation is under control'}
    ],
    linkedreports: [
      {ID: 1111, Description: 'Description4', Time: 1221321423, Type: 'Fire Alarm'},
      {ID: 2222, Description: 'Description1', Time: 1221344423, Type: 'Fire Alarm'},
      {ID: 3333, Description: 'Description2', Time: 1221333423, Type: 'Road Block'},
      {ID: 4444, Description: 'Description3', Time: 1221352423, Type: 'Fire Alarm'},
      {ID: 5555, Description: 'Description5', Time: 1221324423, Type: 'Road Block'}
    ],
    media: [
      {url: 'http://localhost:8100/api/file/1601525743958.jpg', id: '1601525743958.jpg', type: 'image'},
      {url: 'http://localhost:8100/api/file/1601526405336.jpg', id: '1601526405336.jpg', type: 'image'},
      {url: 'http://localhost:8100/api/file/1601526405336.jpg', id: '1601526405336.jpg', type: 'image'},
      {url: 'http://localhost:8100/api/file/1601526405336.jpg', id: '1601526405336.jpg', type: 'image'},
      {url: 'http://localhost:8100/api/file/1601533035168.mp4', id: '1601533035168.mp4', type: 'video'},
    ],
  }];

@Component({
  selector: 'app-reports-situation-table',
  templateUrl: './reports-situation-table.component.html',
  styleUrls: ['./reports-situation-table.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})

export class ReportsSituationTableComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['select', 'id', 'source', 'priority', 'type', 'description', 'time', 'createdBy',
    'message', 'link', 'map', 'attachment'];

  // displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = new MatTableDataSource</*EventsSituation*/ any>(ELEMENT_DATA);
  expandedElement: EventsSituation;
  selection = new SelectionModel<EventsSituation>(true, []);
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  constructor() { }

  ngOnInit(): void {

  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  private selectRow = (element): void => {
    // this.selectedData = aircraft;
    this.expandedElement = this.expandedElement === element ? null : element;
  };

  private isSortingDisabled = (columnText: string): boolean => {
    let res: boolean = false;
    if (columnText === 'message' || columnText === 'link' || columnText === 'map' || columnText === 'attachment') {
      res = true;
    }
    return res;
  };

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => {
          this.selection.select(row);
        }
      );
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: EventsSituation): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }



}