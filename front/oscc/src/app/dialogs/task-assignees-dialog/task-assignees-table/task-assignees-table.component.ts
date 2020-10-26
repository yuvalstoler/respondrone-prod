import {AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {SelectionModel} from '@angular/cdk/collections';
import {MatSort} from '@angular/material/sort';
import {ApplicationService} from '../../../services/applicationService/application.service';
import {FR_DATA_UI} from '../../../../../../../classes/typings/all.typings';
import {ReportService} from '../../../services/reportService/report.service';
import {FRService} from "../../../services/frService/fr.service";




@Component({
  selector: 'app-task-assignees-table',
  templateUrl: './task-assignees-table.component.html',
  styleUrls: ['./task-assignees-table.component.scss']
})
export class TaskAssigneesTableComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['select', 'id',  'type', 'status'];
  dataSource = new MatTableDataSource<FR_DATA_UI>();
  selection = new SelectionModel<FR_DATA_UI>(true, []);
  idsToRemove;
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  constructor(public applicationService: ApplicationService,
              public frService: FRService) {

    this.frService.frs$.subscribe((isNewData: boolean) => {
      if (isNewData && this.idsToRemove) {
        const dataWithoutSelected = this.frService.frs.data.filter((data) => this.idsToRemove.indexOf(data.id) === -1);
        this.dataSource.data = [...dataWithoutSelected];
      }
    });
  }

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }


  checkSelected = (arr: string[]) => {
    // this.dataSource.data.forEach(row => {
    //   if (arr.indexOf(row.id) !== -1) {
    //     this.selection.select(row);
    //   }
    // });
    this.idsToRemove = arr;
    const dataWithoutSelected = this.frService.frs.data.filter((data) => this.idsToRemove.indexOf(data.id) === -1);
    this.dataSource.data = [...dataWithoutSelected];
  };

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

  getSelectedAssignees = () => {
    try {
      return this.selection.selected.map(data => data.id);
    } catch (e) {
      return [];
    }
  };

  getNumOfSelected = () => {
    return this.selection.selected.length;
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
  checkboxLabel = (row?: FR_DATA_UI): string => {
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

  onChangeCheckbox = (event, row: FR_DATA_UI) => {
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
