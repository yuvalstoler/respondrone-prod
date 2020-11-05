import { Component, OnInit } from '@angular/core';
import {AirVehicleService} from "../../../../services/airVehicleService/airVehicle.service";

@Component({
  selector: 'app-air-resources',
  templateUrl: './air-resources.component.html',
  styleUrls: ['./air-resources.component.scss']
})
export class AirResourcesComponent implements OnInit {

  constructor(public airVehicleService: AirVehicleService) { }

  ngOnInit(): void {
  }

}
