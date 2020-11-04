import { Component, OnInit } from '@angular/core';
import {ApplicationService} from '../../../services/applicationService/application.service';

@Component({
  selector: 'app-right-panel',
  templateUrl: './right-panel.component.html',
  styleUrls: ['./right-panel.component.scss']
})
export class RightPanelComponent implements OnInit {

  showAirResources: boolean = false;
  showGroundResources: boolean = false;

  constructor(public applicationService: ApplicationService) { }

  ngOnInit(): void {
  }

  onShowAirResources = () => {
   this.showAirResources = !this.showAirResources;
  };

  onShowGroundResources = () => {
    this.showGroundResources = !this.showGroundResources;
  };

  openSortGroundPanel = () => {

  };

}
