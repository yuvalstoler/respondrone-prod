import { Component, OnInit } from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';

export interface EventsSituation {
  id: string;
  eventTitle: string;
  source: string;
  priority: string;
  type: string;
  description: string;
  time: number;
  createdBy: string;
  message: string;
  link: string;
  map: string;
  descriptionAll: string;
}

@Component({
  selector: 'app-events-situation-table',
  templateUrl: './events-situation-table.component.html',
  styleUrls: ['./events-situation-table.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class EventsSituationTableComponent implements OnInit {

  displayedColumns: string[] = ['id', 'eventTitle', 'source', 'priority', 'type', 'description', 'time', 'createdBy',
    'message', 'link', 'map'];
  dataSource: EventsSituation[] = [
    {id: '1000', eventTitle: 'Road 345 block', source: 'FF133', priority: 'warning', type: 'type',
      description: '1', time: 10, createdBy: 'John Blake', message: 'message', link: 'link', map: 'map', descriptionAll: 'descriptionAlldescriptionAlldescriptionAlldescriptionAll1000'},
    {id: '1001', eventTitle: 'Road 345 block', source: 'FF133', priority: 'warning', type: 'type',
      description: '1', time: 10, createdBy: 'John Blake', message: 'message', link: 'link', map: 'map', descriptionAll: 'descriptionAlldescriptionAlldescriptionAlldescriptionAll1001'},
    {id: '1002', eventTitle: 'Road 345 block', source: 'FF133', priority: 'warning', type: 'type',
      description: '1', time: 10, createdBy: 'John Blake', message: 'message', link: 'link', map: 'map', descriptionAll: 'descriptionAlldescriptionAlldescriptionAlldescriptionAll1002'}];


  selectedData: any;
  expandedElement: EventsSituation;




  constructor() { }

  ngOnInit(): void {
  }

  private selectRow = (element): void => {
    // this.selectedData = aircraft;
    this.expandedElement = this.expandedElement === element ? null : element;
  };

}

