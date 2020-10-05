import { Component, OnInit } from '@angular/core';
import {ApplicationService} from '../../../../services/applicationService/application.service';

@Component({
  selector: 'app-reports-situation-picture',
  templateUrl: './reports-situation-picture.component.html',
  styleUrls: ['./reports-situation-picture.component.scss']
})
export class ReportsSituationPictureComponent implements OnInit {

  constructor(public applicationService: ApplicationService) { }

  ngOnInit(): void {
  }

  onCreateNewReport = () => {
    this.applicationService.screen.showLeftPanel = false;
    this.applicationService.screen.showLeftNarrowPanel = true;
    this.applicationService.screen.showEventPanel = false;
    this.applicationService.screen.showReportPanel = true;

  };

}
