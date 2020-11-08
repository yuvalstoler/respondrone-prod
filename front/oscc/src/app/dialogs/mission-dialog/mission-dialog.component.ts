import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {
  AV_DATA_UI,
  COMMENT,
  GEOPOINT3D,
  GEOPOINT3D_SHORT,
  ID_TYPE, MISSION_STATUS,
  MISSION_TYPE, MISSION_TYPE_TEXT, OBSERVATION_MISSION_REQUEST
} from "../../../../../../classes/typings/all.typings";
import {AirVehicleService} from "../../services/airVehicleService/airVehicle.service";
import {STATE_DRAW} from "../../../types";
import {MapGeneralService} from "../../services/mapGeneral/map-general.service";
import {ApplicationService} from "../../services/applicationService/application.service";
import {LocationService} from "../../services/locationService/location.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {MissionService} from "../../services/missionService/mission.service";

@Component({
  selector: 'app-mission-dialog',
  templateUrl: './mission-dialog.component.html',
  styleUrls: ['./mission-dialog.component.scss']
})
export class MissionDialogComponent implements OnInit {

  @ViewChild('title', {static: true}) firstItem: ElementRef;
  MISSION_TYPE = MISSION_TYPE;
  MISSION_TYPE_TEXT = MISSION_TYPE_TEXT;


  missionTypes = Object.values(MISSION_TYPE);
  selectedMissionType: MISSION_TYPE;
  airVehicleId: ID_TYPE;
  description = '';
  comments = [];

  location: GEOPOINT3D_SHORT = {lat: undefined, lon: undefined, alt: 0};
  viewingAngle = 0
  viewingDistance = 0;



  constructor(public airVehicleService: AirVehicleService,
              public mapGeneralService: MapGeneralService,
              public applicationService: ApplicationService,
              public locationService: LocationService,
              public dialogRef: MatDialogRef<MissionDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: { title: string }) { }

  ngOnInit(): void {
  }

  onChooseMission(missionType: MISSION_TYPE) {
    this.selectedMissionType = missionType;
  }
  onNoClick() {
    this.dialogRef.close(false);
  }
  onChangeComments(comments: COMMENT[]) {
    this.comments = comments;
  }

  onChooseAirVehicle(airVehicle: AV_DATA_UI) {
    this.airVehicleId = airVehicle.id;
  }

  locationChanged(event) {
    if (event.target.value !== '') {
      this.applicationService.stateDraw = STATE_DRAW.notDraw;
      this.mapGeneralService.changeCursor(false);
      if (this.location.lat !== undefined && this.location.lon !== undefined) {
        const locationPoint: GEOPOINT3D = {
          longitude: this.location.lon,
          latitude: this.location.lat
        };
        this.locationService.createOrUpdateLocationTemp(locationPoint);
        this.applicationService.stateDraw = STATE_DRAW.editLocationPoint;
        this.mapGeneralService.changeCursor(true);
      }
    }
  }

  onCreateClick() {
    if (this.selectedMissionType === MISSION_TYPE.observationMission) {
      const data: OBSERVATION_MISSION_REQUEST = {
        droneId: this.airVehicleId,
        status: MISSION_STATUS.Pending,
        observationPoint: this.location,
        observationAzimuth: this.viewingAngle,
        altitudeOffset: this.viewingDistance
      }
    }
    this.dialogRef.close(false);
  }

}
