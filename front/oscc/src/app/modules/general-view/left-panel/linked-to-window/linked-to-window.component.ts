import { Component, OnInit } from '@angular/core';
import {ContextMenuService} from '../../../../services/contextMenuService/context-menu.service';

@Component({
  selector: 'app-linked-to-window',
  templateUrl: './linked-to-window.component.html',
  styleUrls: ['./linked-to-window.component.scss']
})
export class LinkedToWindowComponent implements OnInit {

  constructor(public contextMenuService: ContextMenuService) { }

  ngOnInit(): void {
  }

}
