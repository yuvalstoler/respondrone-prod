import {Component, OnInit, ViewChild} from '@angular/core';
import {LinkedReportTableComponent} from '../linked-report-table/linked-report-table.component';

@Component({
  selector: 'app-linked-report-container',
  templateUrl: './linked-report-container.component.html',
  styleUrls: ['./linked-report-container.component.scss']
})
export class LinkedReportContainerComponent implements OnInit {

  @ViewChild(LinkedReportTableComponent ) childComponent: LinkedReportTableComponent ;
  @ViewChild('inputSearch') inputSearch;

  constructor() { }

  ngOnInit(): void {
  }

  getFilter = (event) => {
    //todo:
    this.childComponent.applyFilter(event);
  };

  clearPanel = () => {
    this.inputSearch.nativeElement.value = ' ';
    this.childComponent.clearFilter();
  };

  onCreateNewReport = () => {

  };

  getSelectedEvents = () => {
    const reportIdArr = this.childComponent.getSelectedReports();
    return reportIdArr;
  }
}
