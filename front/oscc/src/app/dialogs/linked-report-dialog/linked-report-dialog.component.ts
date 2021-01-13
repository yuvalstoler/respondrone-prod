import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {LinkedReportContainerComponent} from './linked-report-container/linked-report-container.component';

@Component({
  selector: 'app-linked-report-dialog',
  templateUrl: './linked-report-dialog.component.html',
  styleUrls: ['./linked-report-dialog.component.scss']
})
export class LinkedReportDialogComponent implements OnInit {

  @ViewChild(LinkedReportContainerComponent) childComponent: LinkedReportContainerComponent ;

  constructor(public dialogRef: MatDialogRef<LinkedReportDialogComponent>,
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
  };

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onAddClick(): void {
    const data = this.childComponent.getSelectedEvents();
    this.dialogRef.close(data);
  }

  isEnableAddBtn() {
    return this.childComponent && this.childComponent.childComponent && this.childComponent.childComponent.getNumOfSelected() > 0;
  }
}
