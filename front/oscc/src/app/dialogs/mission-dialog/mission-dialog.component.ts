import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {
  AV_DATA_UI,
  COMM_RELAY_TYPE_TEXT,
  COMMENT,
  COMMUNICATION_TYPE, FR_DATA_UI,
  GEOPOINT3D_SHORT,
  MISSION_MODEL_UI,
  MISSION_TYPE,
  MISSION_TYPE_TEXT,
  POINT3D
} from '../../../../../../classes/typings/all.typings';
import {AirVehicleService} from '../../services/airVehicleService/airVehicle.service';
import {STATE_DRAW} from '../../../types';
import {MapGeneralService} from '../../services/mapGeneral/map-general.service';
import {ApplicationService} from '../../services/applicationService/application.service';
import {LocationService} from '../../services/locationService/location.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import * as _ from 'lodash';
import {MatAccordion} from '@angular/material/expansion';
import {PolygonService} from '../../services/polygonService/polygon.service';
import {CustomToasterService} from '../../services/toasterService/custom-toaster.service';
import {PolylineService} from '../../services/polylineService/polyline.service';
import {FRService} from '../../services/frService/fr.service';

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
  commRelayTypes = Object.values(COMM_RELAY_TYPE_TEXT);
  COMM_RELAY_TYPE_TEXT = COMM_RELAY_TYPE_TEXT;

  //Model
  missionModel: MISSION_MODEL_UI;
  defaultMission: MISSION_MODEL_UI = {
    missionType: undefined,
    airResources: [],
    location: {lon: undefined, lat: undefined, alt: 0},
    polygon: [],
    polyline: [],
    frs: [],
    frIds: [],
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

  constructor(public airVehicleService: AirVehicleService,
              public mapGeneralService: MapGeneralService,
              public applicationService: ApplicationService,
              public locationService: LocationService,
              public polygonService: PolygonService,
              public polylineService: PolylineService,
              public frService: FRService,
              public customToasterService: CustomToasterService,
              public dialogRef: MatDialogRef<MissionDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: { title: string }) {
    this.initTaskModel();

    // add location to model
    this.locationService.locationPoint$.subscribe(latlon => {
      this.missionModel.location = {lon: latlon.lon, lat: latlon.lat, alt: 0};
    });

    // add polygon to model
    this.polygonService.polygon$.subscribe((positions: POINT3D[]) => {
      this.missionModel.polygon = positions;
    });

    // add polyline to model
    this.polylineService.polyline$.subscribe((positions: POINT3D[]) => {
      this.missionModel.polyline = positions;
    });
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

  onChooseMission = (missionType: MISSION_TYPE) => {
    this.initTaskModel();
    this.missionModel.missionType = missionType;
    this.accordion.closeAll();
    // this.missionsType.expanded = true;
  };

  onChangeComments = (comments: COMMENT[]) => {
    this.missionModel.comments = comments;
  };

  onChooseAirVehicle = (airVehicle: AV_DATA_UI) => {
    if (this.missionModel.missionType === MISSION_TYPE.CommRelay) {
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

  getSelectedLocation = (missionType: MISSION_TYPE): boolean => {
    let res = false;
    switch (missionType) {
      case MISSION_TYPE.Observation: {
        //POINT
        if (this.missionModel.location && this.missionModel.location.hasOwnProperty('lon') &&
          this.missionModel.location.hasOwnProperty('lat') &&
          this.missionModel.location.lon === undefined || this.missionModel.location.lat === undefined) {
          res = true;
        }
        break;
      }
      case MISSION_TYPE.Patrol: {
        //Polyline
        if (this.missionModel.polyline.length === 0) {
          res = true;
        }
        break;
      }
      case MISSION_TYPE.Scan: {
        //Polygon
        if (this.missionModel.polygon.length === 0) {
          res = true;
        }
        break;
      }
      case MISSION_TYPE.Servoing: {
        // TODO: FR Table
        // if () {
        //   res = true;
        // }
        break;
      }
      case MISSION_TYPE.Delivery: {
        //Cargo POINT
        // if () {
        res = true;
        // }
        break;
      }
      case MISSION_TYPE.CommRelay: {
        //Comm
        if (this.missionModel.communicationType === undefined) {
          res = true;
        }
        if (this.missionModel.communicationType === COMMUNICATION_TYPE.fixedPoint &&
          this.missionModel.location && this.missionModel.location.hasOwnProperty('lon') &&
          this.missionModel.location.hasOwnProperty('lat') &&
          this.missionModel.location.lon === undefined || this.missionModel.location.lat === undefined) {
          res = true;
        } else if (this.missionModel.communicationType === COMMUNICATION_TYPE.polygonCoverage &&
          this.missionModel.polygon.length === 0) {
          res = true;
        } else if (this.missionModel.communicationType === COMMUNICATION_TYPE.frs) {
          //  TODO:
          res = true;
        }
        break;
      }
      case undefined : {
        res = true;
        break;
      }
    }
    return res;
  };

  onClickLocation = (missionType: MISSION_TYPE) => {
    switch (missionType) {
      case MISSION_TYPE.Observation: {
        //POINT
        this.missionModel.location = {lon: undefined, lat: undefined, alt: 0};
        this.locationService.deleteLocationPointTemp('0');
        this.missionModel.polygon = [];
        this.polygonService.deletePolygonManually('0');
        this.missionModel.polyline = [];
        this.polylineService.deletePolylineManually('0');
        // toaster
        this.customToasterService.info({message: 'Click on map to set the event\'s location', title: 'location'});
        //draw
        this.applicationService.stateDraw = STATE_DRAW.drawLocationPoint;
        this.mapGeneralService.changeCursor(true);

        break;
      }
      case MISSION_TYPE.Patrol: {
        //Polyline
        this.missionModel.location = {lon: undefined, lat: undefined, alt: 0};
        this.locationService.deleteLocationPointTemp('0');
        this.missionModel.polygon = [];
        this.polygonService.deletePolygonManually('0');
        this.missionModel.polyline = [];
        this.polylineService.deletePolylineManually('0');
        // toaster
        this.customToasterService.info(
          {message: 'Click minimum 2 points to set a polyline. Click double click to finish', title: 'polyline'});
        //draw
        this.applicationService.stateDraw = STATE_DRAW.drawPolyline;
        this.mapGeneralService.changeCursor(true);

        break;
      }
      case MISSION_TYPE.Scan: {
        //Polygon
        this.missionModel.location = {lon: undefined, lat: undefined, alt: 0};
        this.locationService.deleteLocationPointTemp('0');
        this.missionModel.polygon = [];
        this.polygonService.deletePolygonManually('0');
        this.missionModel.polyline = [];
        this.polylineService.deletePolylineManually('0');
        // toaster
        this.customToasterService.info(
          {message: 'Click minimum 3 points to set a polygon. Click double click to finish', title: 'polygon'});
        //draw
        this.applicationService.stateDraw = STATE_DRAW.drawPolygon;
        this.mapGeneralService.changeCursor(true);
        break;
      }
      case MISSION_TYPE.Servoing: {
        //FR Table
        break;
      }
    }
  };

  locationChanged = (event) => {
    if (event.target.value !== '') {
      this.applicationService.stateDraw = STATE_DRAW.notDraw;
      this.mapGeneralService.changeCursor(false);
      if (this.missionModel.location.lat !== undefined && this.missionModel.location.lon !== undefined) {
        const locationPoint: GEOPOINT3D_SHORT = {
          lon: this.missionModel.location.lon,
          lat: this.missionModel.location.lat,
          alt: 0
        };
        this.locationService.createOrUpdateLocationTemp(locationPoint);
        this.applicationService.stateDraw = STATE_DRAW.editLocationPoint;
        this.mapGeneralService.changeCursor(true);
      }
    }
  };

  onUpdateFRs = (frIds: string[]) => {
    if (frIds && Array.isArray(frIds)) {
      this.missionModel.frIds = frIds;
      const assignees = [];
      this.missionModel.frIds.forEach((id: string) => {
        const assignee: FR_DATA_UI = this.frService.getFRById(id);
        assignees.push(assignee);
      });
      this.missionModel.frs = assignees;
    }
  };

  onCreateClick = () => {
    // console.log(this.missionModel);
    this.dialogRef.close(this.missionModel);
    this.clearModel();
  };

  onNoClick() {
    this.clearModel();
    this.dialogRef.close(false);
  }

  clearModel = () => {
    this.missionModel = _.cloneDeep(this.defaultMission);
    this.applicationService.stateDraw = STATE_DRAW.notDraw;
    this.mapGeneralService.changeCursor(false);
    this.locationService.deleteLocationPointTemp('0');
    this.polygonService.deletePolygonManually('0');
    this.polylineService.deletePolylineManually('0');
  };

}
