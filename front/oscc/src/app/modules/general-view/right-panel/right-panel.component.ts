import {Component, OnInit} from '@angular/core';
import {ApplicationService} from '../../../services/applicationService/application.service';
import {SORT_AIR_RESOURCES, SORT_GROUND_RESOURCES} from '../../../../types';

@Component({
  selector: 'app-right-panel',
  templateUrl: './right-panel.component.html',
  styleUrls: ['./right-panel.component.scss']
})
export class RightPanelComponent implements OnInit {

  showAirResources: boolean = false;
  showGroundResources: boolean = false;
  optionGroundSelected: string = 'id';
  optionAirSelected: string = 'id';
  sortGroundList: SORT_GROUND_RESOURCES[] = Object.values(SORT_GROUND_RESOURCES);
  sortAirList: SORT_AIR_RESOURCES[] = Object.values(SORT_AIR_RESOURCES);

  constructor(public applicationService: ApplicationService) {
  }

  ngOnInit(): void {
  }

  onShowAirResources = () => {
    this.showAirResources = !this.showAirResources;
  };

  onShowGroundResources = () => {
    this.showGroundResources = !this.showGroundResources;
  };

  onSortAirList = (sortAir: SORT_AIR_RESOURCES) => {
    this.optionAirSelected = sortAir;
  };

  onSortGroundList = (sortGround: SORT_GROUND_RESOURCES) => {
    this.optionGroundSelected = sortGround;
  };
}
