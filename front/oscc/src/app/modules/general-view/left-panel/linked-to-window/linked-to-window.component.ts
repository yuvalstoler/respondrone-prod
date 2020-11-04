import {Component, Input, OnInit} from '@angular/core';
import {ContextMenuService} from '../../../../services/contextMenuService/context-menu.service';
import {LINKED_EVENT_DATA, LINKED_REPORT_DATA} from '../../../../../../../../classes/typings/all.typings';

@Component({
  selector: 'app-linked-to-window',
  templateUrl: './linked-to-window.component.html',
  styleUrls: ['./linked-to-window.component.scss']
})
export class LinkedToWindowComponent implements OnInit {

  selectedLinks: LINKED_REPORT_DATA[] | LINKED_EVENT_DATA[];

  constructor(public contextMenuService: ContextMenuService) { }

  ngOnInit(): void {
  }

  onNoClick = () => {
    this.contextMenuService.closeLinkToMenu();
  };

  onUnlinkClick = () => {
    // todo: unlink
    console.log(this.selectedLinks);
    if (this.contextMenuService.type === 'report') {

    } else if (this.contextMenuService.type === 'event') {

    }

    this.onNoClick();
  };


}
