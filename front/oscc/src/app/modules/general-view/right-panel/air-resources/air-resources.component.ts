import {AirVehicleService} from '../../../../services/airVehicleService/airVehicle.service';
import {Component, Input, OnInit} from '@angular/core';
import {MAP} from '../../../../../types';
import {AV_DATA_UI} from "../../../../../../../../classes/typings/all.typings";

@Component({
  selector: 'app-air-resources',
  templateUrl: './air-resources.component.html',
  styleUrls: ['./air-resources.component.scss']
})
export class AirResourcesComponent implements OnInit {


  @Input() optionSelected: string;
  isOpenMenu: MAP<any> = {};

  constructor(public airVehicleService: AirVehicleService) { }

  ngOnInit(): void {
  }

  onOpenMenu = (id) => {
    this.isOpenMenu[id] = true;
  };

  onCloseMenu = (id) => {
    this.isOpenMenu[id] = false;
  };

  flyTo = (airVehicle: AV_DATA_UI) => {
    this.airVehicleService.flyToObject(airVehicle)
  }

}
