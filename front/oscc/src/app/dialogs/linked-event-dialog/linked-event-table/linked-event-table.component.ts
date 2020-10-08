import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {SelectionModel} from '@angular/cdk/collections';
import {ApplicationService} from '../../../services/applicationService/application.service';
import {MatSort} from '@angular/material/sort';

export interface LinkedEvent {
  id: string;
  type: string;
  description: string;
  time: number;
  createdBy: string;
}

const ELEMENT_DATA: LinkedEvent[] = [
  {
    id: '1000', type: 'Fire Alarm',
    description: 'description1', time: 10, createdBy: 'John Blake'
  },
  {
    id: '1001', type: 'Road Block',
    description: 'description2', time: 10, createdBy: 'John Blake'
  },
  {
    id: '1002', type: 'Accident',
    description: 'description3', time: 10, createdBy: 'John Blake'
  }];


@Component({
  selector: 'app-linked-event-table',
  templateUrl: './linked-event-table.component.html',
  styleUrls: ['./linked-event-table.component.scss']
})
export class LinkedEventTableComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['select', 'id', 'type', 'description', 'time', 'createdBy'];
  dataSource = new MatTableDataSource< any>(ELEMENT_DATA);
  selection = new SelectionModel<LinkedEvent>(true, []);
  @ViewChild(MatSort, {static: false}) sort: MatSort;


  constructor(private applicationService: ApplicationService) {
  }

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  private selectRow = (element): void => {
    // if (this.applicationService.selectedReport === undefined) {
    //   this.applicationService.selectedReport = element;
    // } else {
    //   this.applicationService.selectedReport = undefined;
    // }

    // this.expandedElement = this.expandedElement === element ? null : element;
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
  checkboxLabel = (row?: LinkedEvent): string => {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  };

  onChangeAllSelected = (event) => {
    // if (event.checked) {
    //   this.dataSource.data.forEach((row: ReportsSituation) => {
    //     this.expandedElement[row.id] = this.expandedElement[row.id] || {};
    //     this.expandedElement[row.id] = row;
    //   });
    // } else {
    //   this.dataSource.data.forEach((row: ReportsSituation) => {
    //     this.expandedElement[row.id] = {};
    //   });
    // }
    return event ? this.masterToggle() : null;
  };

  onChangeCheckbox = (event, row: LinkedEvent) => {
    // if (event.checked) {
    //   this.expandedElement[row.id] = this.expandedElement[row.id] || {};
    //   this.expandedElement[row.id] = row;
    //   // this.applicationService.selectedReport = row;
    // } else {
    //   this.expandedElement[row.id] = {};
    //   // this.applicationService.selectedReport = undefined;
    // }
    return event ? this.selection.toggle(row) : null;
  }

}
