import {AirVehicleService} from '../../../../services/airVehicleService/airVehicle.service';
import {Component, Input, OnInit} from '@angular/core';
import {MAP} from '../../../../../types';

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

}
