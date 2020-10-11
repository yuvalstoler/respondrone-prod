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
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onAddClick(): void {
    const data = this.childComponent.getSelectedEvents();
    this.dialogRef.close(data);
  }
}
