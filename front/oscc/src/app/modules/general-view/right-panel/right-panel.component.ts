import {Component, OnInit} from '@angular/core';
import {ApplicationService} from '../../../services/applicationService/application.service';
import {SORT_AIR_RESOURCES, SORT_GROUND_RESOURCES} from '../../../../types';

@Component({
  selector: 'app-right-panel',
  templateUrl: './right-panel.component.html',
  styleUrls: ['./right-panel.component.scss']
})
export class RightPanelComponent implements OnInit {

  showAirResources: boolean = true;
  showGroundResources: boolean = true;
  optionGroundSelected: {type: string, field: string } = {type: 'SORT_GROUND_RESOURCES', field: 'id'};
  optionAirSelected: {type: string, field: string } = {type: 'SORT_AIR_RESOURCES', field: 'id'};
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
    this.optionAirSelected.field = sortAir;
  };

  onSortGroundList = (sortGround: SORT_GROUND_RESOURCES) => {
    this.optionGroundSelected.field = sortGround;
  };
}
