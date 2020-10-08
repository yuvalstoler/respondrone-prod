import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ApplicationService} from '../../services/applicationService/application.service';

@Component({
  selector: 'app-linked-event-dialog',
  templateUrl: './linked-event-dialog.component.html',
  styleUrls: ['./linked-event-dialog.component.scss']
})
export class LinkedEventDialogComponent implements OnInit {

  constructor(private applicationService: ApplicationService,
              public dialogRef: MatDialogRef<LinkedEventDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onCreateNewEvent = () => {
    this.onNoClick();
    this.applicationService.screen.showLeftPanel = false;
    this.applicationService.screen.showLeftNarrowPanel = true;
    this.applicationService.screen.showReportPanel = false;
    this.applicationService.screen.showEventPanel = true;
  };

}
