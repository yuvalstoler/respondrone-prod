import {Component, OnInit, ViewChild} from '@angular/core';
import {TaskAssigneesTableComponent} from '../task-assignees-table/task-assignees-table.component';

@Component({
  selector: 'app-task-assignees-container',
  templateUrl: './task-assignees-container.component.html',
  styleUrls: ['./task-assignees-container.component.scss']
})
export class TaskAssigneesContainerComponent implements OnInit {

  @ViewChild(TaskAssigneesTableComponent ) childComponent: TaskAssigneesTableComponent ;
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

  getSelected = () => {
    const reportIdArr = this.childComponent.getSelectedAssignees();
    return reportIdArr;
  }
}
