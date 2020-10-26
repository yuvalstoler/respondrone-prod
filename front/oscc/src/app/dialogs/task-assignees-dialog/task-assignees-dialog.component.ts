import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {TaskAssigneesContainerComponent} from './task-assignees-container/task-assignees-container.component';

@Component({
  selector: 'app-task-assignees-dialog',
  templateUrl: './task-assignees-dialog.component.html',
  styleUrls: ['./task-assignees-dialog.scss']
})
export class TaskAssigneesDialogComponent implements OnInit {

  @ViewChild(TaskAssigneesContainerComponent) childComponent: TaskAssigneesContainerComponent ;

  constructor(public dialogRef: MatDialogRef<TaskAssigneesDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: string[]) { }

  ngOnInit(): void {
    this.updateLinkedData();
  }

  updateLinkedData = () => {
    if (this.childComponent && this.childComponent.childComponent) {
      this.childComponent.childComponent.checkSelected(this.data);
    } else {
      setTimeout(this.updateLinkedData, 50);
    }
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onAddClick(): void {
    const data = this.childComponent.getSelected();
    this.dialogRef.close(data);
  }

  isEnableAddBtn() {
    return this.childComponent && this.childComponent.childComponent && this.childComponent.childComponent.getNumOfSelected() > 0;
  }
}
