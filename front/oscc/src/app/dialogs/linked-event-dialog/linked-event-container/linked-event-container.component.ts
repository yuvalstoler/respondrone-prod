import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {LinkedEventTableComponent} from '../linked-event-table/linked-event-table.component';
import {ApplicationService} from '../../../services/applicationService/application.service';

@Component({
  selector: 'app-linked-event-container',
  templateUrl: './linked-event-container.component.html',
  styleUrls: ['./linked-event-container.component.scss']
})
export class LinkedEventContainerComponent implements OnInit {

  @ViewChild(LinkedEventTableComponent ) childComponent: LinkedEventTableComponent ;
  @ViewChild('inputSearch') inputSearch;
  @Input() createEvent;

  constructor() { }

  ngOnInit(): void {
  }

  getFilter = (event) => {
    this.childComponent.applyFilter(event);
  };

  clearPanel = () => {
    this.inputSearch.nativeElement.value = ' ';
    this.childComponent.clearFilter();
  };

  onCreateNewEvent = () => {
    // this.createEvent.onCreateNewEvent();
  };

  getSelectedEvents = () => {
    const reportIdArr = this.childComponent.getSelectedEvents();
    return reportIdArr;
  };

}
