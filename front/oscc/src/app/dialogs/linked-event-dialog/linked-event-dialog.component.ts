import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ApplicationService} from '../../services/applicationService/application.service';
import {LinkedEventContainerComponent} from './linked-event-container/linked-event-container.component';

@Component({
  selector: 'app-linked-event-dialog',
  templateUrl: './linked-event-dialog.component.html',
  styleUrls: ['./linked-event-dialog.component.scss']
})
export class LinkedEventDialogComponent implements OnInit {

  @ViewChild(LinkedEventContainerComponent ) childComponent: LinkedEventContainerComponent ;

  constructor(private applicationService: ApplicationService,
              public dialogRef: MatDialogRef<LinkedEventDialogComponent>,
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

  onCreateNewEvent = () => {
    this.onNoClick();
    this.applicationService.setLeftPanelFalse();
  };

}
