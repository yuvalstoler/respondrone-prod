import {Component, OnInit, Input, ViewChild, AfterViewInit} from '@angular/core';
import {MatSort} from '@angular/material/sort';

@Component({
  selector: 'app-linked-reports-table',
  templateUrl: './linked-reports-table.component.html',
  styleUrls: ['./linked-reports-table.component.scss']
})
export class LinkedReportsTableComponent implements OnInit, AfterViewInit {

  @Input() element;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = ['ID', 'Type', 'Description', 'Time'];
  
  constructor() {
  }

  ngOnInit(): void {
  }


  ngAfterViewInit() {
    // const element  = new MatTableDataSource(this.element.linkedreports);
    // element.sort = this.sort;
    this.element.linkedreports.sort = this.sort;
  }

  selectRow = (row) => {
    
  };
  
}
