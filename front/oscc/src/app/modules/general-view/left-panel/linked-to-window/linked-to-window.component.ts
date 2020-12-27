import {Component, Input, OnInit} from '@angular/core';
import {ContextMenuService} from '../../../../services/contextMenuService/context-menu.service';
import {ID_TYPE, LINKED_EVENT_DATA, LINKED_REPORT_DATA} from '../../../../../../../../classes/typings/all.typings';
import {ReportService} from "../../../../services/reportService/report.service";
import {EventService} from "../../../../services/eventService/event.service";

@Component({
  selector: 'app-linked-to-window',
  templateUrl: './linked-to-window.component.html',
  styleUrls: ['./linked-to-window.component.scss']
})
export class LinkedToWindowComponent implements OnInit {

  selectedLinks: (LINKED_EVENT_DATA | LINKED_REPORT_DATA)[];

  constructor(public contextMenuService: ContextMenuService,
              private reportService: ReportService,
              private eventService: EventService) { }

  ngOnInit(): void {
  }

  onNoClick = () => {
    this.contextMenuService.closeLinkToMenu();
  };

  onUnlinkClick = () => {
    if (this.selectedLinks && this.selectedLinks.length > 0) {
     const ids = this.selectedLinks.map(obj => obj.id);
      if (this.contextMenuService.type === 'report') {
        const report = this.reportService.getReportById(this.contextMenuService.selectedLinkTo.id);
        if (report) {
          ids.forEach((id: ID_TYPE) => {
            const index = report.eventIds.indexOf(id);
            if (index !== -1) {
              report.eventIds.splice(index, 1);
            }
          })
          this.reportService.createReport(report);
          this.eventService.unlinkEventsFromReport(ids, this.contextMenuService.selectedLinkTo.id);
        }

      }
      else if (this.contextMenuService.type === 'event') {
        const event = this.eventService.getEventById(this.contextMenuService.selectedLinkTo.id);
        if (event) {
          ids.forEach((id: ID_TYPE) => {
            const index = event.reportIds.indexOf(id);
            if (index !== -1) {
              event.reportIds.splice(index, 1);
            }
          })
          this.eventService.createEvent(event);
          this.reportService.unlinkReportsFromEvent(ids, this.contextMenuService.selectedLinkTo.id);
        }
      }
    }
    this.onNoClick();
  };


}
