import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {
  AV_DATA_UI, COMM_RELAY_TYPE_TEXT,
  COMMENT, MISSION_TYPE,
  MISSION_MODEL_UI,
  MISSION_TYPE_TEXT
} from '../../../../../../classes/typings/all.typings';
import {AirVehicleService} from '../../services/airVehicleService/airVehicle.service';
import {STATE_DRAW} from '../../../types';
import {MapGeneralService} from '../../services/mapGeneral/map-general.service';
import {ApplicationService} from '../../services/applicationService/application.service';
import {LocationService} from '../../services/locationService/location.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import * as _ from 'lodash';
import {MatAccordion} from '@angular/material/expansion';

@Component({
  selector: 'app-mission-dialog',
  templateUrl: './mission-dialog.component.html',
  styleUrls: ['./mission-dialog.component.scss']
})
export class MissionDialogComponent implements OnInit {

  @ViewChild(MatAccordion) accordion: MatAccordion;
  MISSION_TYPE = MISSION_TYPE;
  MISSION_TYPE_TEXT = MISSION_TYPE_TEXT;
  missionTypes = Object.values(MISSION_TYPE);
  COMM_RELAY_TYPE_TEXT =  Object.values(COMM_RELAY_TYPE_TEXT);


  //Model
  missionModel: MISSION_MODEL_UI;
  defaultMission: MISSION_MODEL_UI = {
    missionType: undefined,
    airResources: [],
    location: {lon: undefined, lat: undefined, alt: 0},
    polygon: [],
    polyline: [],
    frs: [],
    communicationType: undefined,
    missionDetails: {
      azimuth: 0,
      distance: 0,
      scan: {
        speed: undefined,
        overlapPercent: 0,
        cameraFov: 0
      }
    },
    description: '',
    comments: []
  };

  selectedAirVehicles: AV_DATA_UI[] = [];

  // selectedMissionType: MISSION_TYPE;
  // selectedAirVehicle: AV_DATA_UI;
  // description = '';
  // comments = [];
  //
  // location: GEOPOINT3D_SHORT = {lat: undefined, lon: undefined, alt: 0};
  // viewingAngle = 0;
  // viewingDistance = 0;



  constructor(public airVehicleService: AirVehicleService,
              public mapGeneralService: MapGeneralService,
              public applicationService: ApplicationService,
              public locationService: LocationService,
              public dialogRef: MatDialogRef<MissionDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: { title: string }) {
    this.initTaskModel();
  }

  ngOnInit(): void {
  }

  private initTaskModel = () => {
    if (this.applicationService.selectedTasks.length === 1) {
      this.missionModel = _.cloneDeep(this.applicationService.selectedMissions[0]);
    } else {
      this.missionModel = _.cloneDeep(this.defaultMission);
    }
    this.selectedAirVehicles = [];
  };

  onNoClick() {
    this.dialogRef.close(false);
  }

  onChooseMission = (missionType: MISSION_TYPE) => {
    this.initTaskModel();
    this.missionModel.missionType = missionType;
    // this.accordion.closeAll();
  };

  onChangeComments = (comments: COMMENT[]) => {
    // this.comments = comments;
  };

  onChooseAirVehicle = (airVehicle: AV_DATA_UI) => {
    if ( this.missionModel.missionType === MISSION_TYPE.CommRelay) {
      const index = this.missionModel.airResources.findIndex(d => d === airVehicle.id);
      if (index !== -1) {
        this.missionModel.airResources.splice(index, 1);
        this.selectedAirVehicles.splice(index, 1);
      } else {
        this.missionModel.airResources.push(airVehicle.id);
        this.selectedAirVehicles.push(airVehicle);
      }
    } else {
      this.missionModel.airResources = [];
      this.selectedAirVehicles = [];
      this.missionModel.airResources.push(airVehicle.id);
      this.selectedAirVehicles.push(airVehicle);
    }
  };

  getSelectedAV = (airVehicleId): boolean => {
    let res: boolean = false;
    this.missionModel.airResources.forEach(avId => {
      if (avId === airVehicleId) {
        res = true;
      }
    });
    return res;
  };

  locationChanged = (event) => {
    if (event.target.value !== '') {
      this.applicationService.stateDraw = STATE_DRAW.notDraw;
      this.mapGeneralService.changeCursor(false);
      // if (this.location.lat !== undefined && this.location.lon !== undefined) {
      //   const locationPoint: GEOPOINT3D = {
      //     longitude: this.location.lon,
      //     latitude: this.location.lat
      //   };
      //   this.locationService.createOrUpdateLocationTemp(locationPoint);
      //   this.applicationService.stateDraw = STATE_DRAW.editLocationPoint;
      //   this.mapGeneralService.changeCursor(true);
      // }
    }
  };

  onCreateClick = () => {
    // if (this.selectedMissionType === MISSION_TYPE.Observation) {
    //   const data: OBSERVATION_MISSION_REQUEST = {
    //     droneId: this.selectedAirVehicle.id,
    //     status: MISSION_STATUS.Pending,
    //     observationPoint: this.location,
    //     observationAzimuth: this.viewingAngle,
    //     altitudeOffset: this.viewingDistance
    //   };
    // }
    this.dialogRef.close();
  }

}
