import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-linked-reports-table',
  templateUrl: './linked-reports-table.component.html',
  styleUrls: ['./linked-reports-table.component.scss']
})
export class LinkedReportsTableComponent implements OnInit {

  // @Input() column;
  @Input() element;

  displayedColumns: string[] = ['ID', 'Type', 'Description', 'Time']; 
  
  constructor() {
  }

  ngOnInit(): void {
  }

  selectRow = (row) => {
    
  };
  
}
