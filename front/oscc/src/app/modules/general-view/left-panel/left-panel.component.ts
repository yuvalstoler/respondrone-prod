import {Component, OnInit} from '@angular/core';
import {ApplicationService} from 'src/app/services/applicationService/application.service';
import {HEADER_BUTTONS, LEFT_PANEL_ICON} from 'src/types';
import {ContextMenuService} from '../../../services/contextMenuService/context-menu.service';
import {MatTabChangeEvent} from '@angular/material/tabs';
import {ReportService} from '../../../services/reportService/report.service';
import {EventService} from '../../../services/eventService/event.service';

@Component({
  selector: 'app-left-panel',
  templateUrl: './left-panel.component.html',
  styleUrls: ['./left-panel.component.scss'],
})
export class LeftPanelComponent implements OnInit {

  Header_Buttons = HEADER_BUTTONS;

  constructor(public applicationService: ApplicationService,
              public contextMenuService: ContextMenuService,
              private reportService: ReportService,
              private eventService: EventService) {
  }

  ngOnInit(): void {
  }

  minimizationPanel = () => {
    if (this.applicationService.panelIcon === LEFT_PANEL_ICON.expand) {
      this.applicationService.panelIcon = LEFT_PANEL_ICON.collapse;
    } else {
      this.applicationService.panelIcon = LEFT_PANEL_ICON.expand;
    }
  };

  onSituationPictureTabChange = (event: MatTabChangeEvent) => {
    this.applicationService.currentTabIndex = event.index;
    this.contextMenuService.closeLinkToMenu();
    this.resetSelected();
  };

  getSelectedMissionControlIndex(): number {
    return this.applicationService.currentTabIndex;
  }

  getSelectedSituationPictureIndex(): number {
    return this.applicationService.currentTabIndex;
  }

  onMissionControlTabChange = (event: MatTabChangeEvent) => {
    this.applicationService.currentTabIndex = event.index;
    this.resetSelected();
  };

  resetSelected = () => {
    this.reportService.unselectReport(this.reportService.selectedElement);
    this.eventService.unselectEvent(this.eventService.selectedElement);
    this.reportService.selectedElement = this.eventService.selectedElement = undefined;
  }
}
