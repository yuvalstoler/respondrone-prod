import {AirVehicleService} from '../../../../services/airVehicleService/airVehicle.service';
import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-air-resources',
  templateUrl: './air-resources.component.html',
  styleUrls: ['./air-resources.component.scss']
})
export class AirResourcesComponent implements OnInit {


  @Input() optionSelected: string;

  constructor(public airVehicleService: AirVehicleService) { }

  ngOnInit(): void {
  }

}
