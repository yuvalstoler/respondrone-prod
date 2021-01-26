import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FR_DATA} from '../../../../../../../classes/typings/all.typings';
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

  @Input() frs: any /*(TASK_DATA_UI | MISSION_MODEL_UI)*/;
  @Input() ids: any /*(TASK_DATA_UI | MISSION_MODEL_UI)*/;
  @Input() title: string;
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  @Output() updateAssignees = new EventEmitter<string[]>();

  displayedColumns: string[] = ['ID', 'Type', 'Status', 'actionsColumn'];
  dataSource: MatTableDataSource<FR_DATA>;

  constructor(public dialog: MatDialog,
              public applicationService: ApplicationService,
              public frService: FRService) {
  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.frs);
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  selectRow = (row) => {

  };

  removeAt = (row: FR_DATA) => {
    const index = this.ids.indexOf(row.id);
    if (index !== -1) {
      this.ids.splice(index, 1);
    }
    this.updateAssignees.emit(this.ids);
  };

  onAddAssignee = () => {
    if (this.frService.frs.data.length > 0) {
      this.openAddAssigneeDialog();
    }

  };

  openAddAssigneeDialog = (): void => {
    const data = {
      title: this.title,
      ids: this.ids
    };
    const dialogRef = this.dialog.open(TaskAssigneesDialogComponent, {
      maxWidth: '90%',
      disableClose: true,
      data: data
    });

    dialogRef.afterClosed().subscribe((result: string[]) => {
      if (result && Array.isArray(result)) {
        const allLinked = [...this.ids, ...result];
        this.updateAssignees.emit(allLinked);
      }
    });
  };


}
