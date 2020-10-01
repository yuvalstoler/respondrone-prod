import {Component, OnInit} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {SelectionModel} from '@angular/cdk/collections';
import {MatTableDataSource} from '@angular/material/table';

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
  comments: Array<{source: string, time: number, text: string}>;
  linkedreports: Array<{ID: number, Type: string, Description: string, Time: number}>;
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
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class EventsSituationTableComponent implements OnInit {

  displayedColumns: string[] = ['select', 'id', 'eventTitle', 'source', 'priority', 'type', 'description', 'time', 'createdBy',
    'message', 'link', 'map'];
  // dataSource: EventsSituation[] = [];
  dataSource = new MatTableDataSource(ELEMENT_DATA);
  selectedData: any;
  expandedElement: EventsSituation;
  selection = new SelectionModel<EventsSituation>(true, []);
  displayedColumns1: string[] = ['ID', 'Type', 'Description', 'Time'];

  constructor() {
  }

  ngOnInit(): void {
  }

  private selectRow = (element): void => {
    // this.selectedData = aircraft;
    this.expandedElement = this.expandedElement === element ? null : element;
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
          console.log(row);
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
