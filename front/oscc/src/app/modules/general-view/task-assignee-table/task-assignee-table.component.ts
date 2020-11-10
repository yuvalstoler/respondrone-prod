import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {
  FR_DATA,
  TASK_DATA_UI
} from '../../../../../../../classes/typings/all.typings';
import {MatDialog} from '@angular/material/dialog';
import {ApplicationService} from '../../../services/applicationService/application.service';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {TaskAssigneesDialogComponent} from '../../../dialogs/task-assignees-dialog/task-assignees-dialog.component';
import {FRService} from '../../../services/frService/fr.service';

@Component({
  selector: 'app-task-assignee-table',
  templateUrl: './task-assignee-table.component.html',
  styleUrls: ['./task-assignee-table.component.scss']
})
export class TaskAssigneeTableComponent implements OnInit {
  //
  // @Input() isFRs: boolean;
  @Input() element: TASK_DATA_UI;
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  @Output() updateAssignees = new EventEmitter<string[]>();

  displayedColumns: string[] = ['ID', 'Type', 'Status', 'actionsColumn'];
  dataSource:  MatTableDataSource<FR_DATA>;

  constructor(public dialog: MatDialog,
              public applicationService: ApplicationService,
              public frService: FRService) { }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.element.assignees);
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  selectRow = (row) => {

  };

  removeAt = (row: FR_DATA) => {
    const assigneeIds = [...this.element.assigneeIds];
    const index = assigneeIds.indexOf(row.id);
    if (index !== -1) {
      assigneeIds.splice(index, 1);
    }
    this.updateAssignees.emit(assigneeIds);
  };

  onAddAssignee = () => {
    if (this.frService.frs.data.length > 0) {
      this.openAddAssigneeDialog();
    }

  };

  openAddAssigneeDialog = (): void => {
    const dialogRef = this.dialog.open(TaskAssigneesDialogComponent, {
      width: '700px',
      disableClose: true,
      data: this.element.assigneeIds
    });

    dialogRef.afterClosed().subscribe((result: string[]) => {
      if (result && Array.isArray(result)) {
        const allLinked = [...this.element.assigneeIds, ...result];
        this.updateAssignees.emit(allLinked);
      }
    });
  };




}
