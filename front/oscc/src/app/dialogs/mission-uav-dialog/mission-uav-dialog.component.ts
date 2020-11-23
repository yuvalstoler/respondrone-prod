import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {AirVehicleService} from '../../services/airVehicleService/airVehicle.service';
import {AV_DATA_UI, MISSION_TYPE} from '../../../../../../classes/typings/all.typings';
import {ApplicationService} from '../../services/applicationService/application.service';

@Component({
  selector: 'app-mission-uav-dialog',
  templateUrl: './mission-uav-dialog.component.html',
  styleUrls: ['./mission-uav-dialog.component.scss']
})
export class MissionUavDialogComponent implements OnInit {

  uavModel: string[] = [];
  selectedAirVehicles: AV_DATA_UI[] = [];

  constructor(public airVehicleService: AirVehicleService,
              public applicationService: ApplicationService,
              public dialogRef: MatDialogRef<MissionUavDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: {title: string}) {
  }

  ngOnInit(): void {
  }

  onChooseAirVehicle = (airVehicle: AV_DATA_UI) => {
      const index = this.uavModel.findIndex(d => d === airVehicle.id);
      if (index !== -1) {
        this.uavModel.splice(index, 1);
        this.selectedAirVehicles.splice(index, 1);
      } else {
        this.uavModel.push(airVehicle.id);
        this.selectedAirVehicles.push(airVehicle);
      }
    /* } else {
       this.uavModel.airResources = [];
       this.selectedAirVehicles = [];
       this.uavModel.airResources.push(airVehicle.id);
       this.selectedAirVehicles.push(airVehicle);
     }*/
  };

  getSelectedAV = (airVehicleId): boolean => {
    let res: boolean = false;
    this.uavModel.forEach(avId => {
      if (avId === airVehicleId) {
        res = true;
      }
    });
    return res;
  };

  onCreateClick = () => {
    // console.log(this.uavModel);
    this.dialogRef.close(this.uavModel);
    this.clearModel();
  };

  onNoClick() {
    this.clearModel();
    this.dialogRef.close(false);
  }

  clearModel = () => {
    this.applicationService.isDialogOpen = false;
    this.uavModel = [];
    this.selectedAirVehicles = [];
    // this.missionModel = _.cloneDeep(this.defaultMission);
  };

}
