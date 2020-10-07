import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-linked-report-dialog',
  templateUrl: './linked-report-dialog.component.html',
  styleUrls: ['./linked-report-dialog.component.scss']
})
export class LinkedReportDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<LinkedReportDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }
}
