import {Component, OnInit, Input, ViewChild, AfterViewInit} from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

@Component({
  selector: 'app-linked-reports-table',
  templateUrl: './linked-reports-table.component.html',
  styleUrls: ['./linked-reports-table.component.scss']
})
export class LinkedReportsTableComponent implements OnInit, AfterViewInit {

  @Input() element;
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  displayedColumns: string[] = ['ID', 'Type', 'Description', 'Time'];
  
  constructor() {
  }

  ngOnInit(): void {
    this.element.linkedreports = new MatTableDataSource(this.element.linkedreports);
  }


  ngAfterViewInit() {
    // this.element.linkedreports = new MatTableDataSource(this.element.linkedreports);
    this.element.linkedreports.sort = this.sort;
  }

  selectRow = (row) => {
    
  };

  removeAll() {
    this.element.linkedreports.data = [];
  }

  removeAt(index: number) {
    const data = this.element.linkedreports.data;
    data.splice( index, 1);

    this.element.linkedreports.data = data;
  }


}
