import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {
  AV_DATA_UI,
  COMM_RELAY_TYPE,
  COMM_RELAY_TYPE_TEXT,
  COMMENT,
  FR_DATA_UI,
  GEOPOINT3D_SHORT,
  MISSION_MODEL_UI,
  MISSION_TYPE,
  MISSION_TYPE_TEXT,
  OPERATIONAL_STATUS,
  POINT3D,
  SCAN_SPEED,
  YAW_ORIENTATION
} from '../../../../../../classes/typings/all.typings';
import {AirVehicleService} from '../../services/airVehicleService/airVehicle.service';
import {HEADER_BUTTONS, MISSION_FIELDS, STATE_DRAW, VIDEO_OR_MAP} from '../../../types';
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
  missionTypes = [MISSION_TYPE.CommRelay, MISSION_TYPE.Patrol, MISSION_TYPE.Scan, MISSION_TYPE.Observation, MISSION_TYPE.Servoing]; // Object.values(MISSION_TYPE);
  commRelayTypes = Object.values(COMM_RELAY_TYPE);
  yawOrientationTypes = Object.values(YAW_ORIENTATION);
  COMM_RELAY_TYPE_TEXT = COMM_RELAY_TYPE_TEXT;
  COMM_RELAY_TYPE = COMM_RELAY_TYPE;
  OPERATIONAL_STATUS = OPERATIONAL_STATUS;
  scanSpeed = Object.values(SCAN_SPEED);
  step = 0;
  MISSION_FIELDS = MISSION_FIELDS;
  isDisabledFields;
  defaultDisabledFields = {
    airResources: true,
    location: true,
    commType: true,
    commArg: true,
    missionDetails: true,
    description: true,
    comments: true
  };
  STATE_DRAW = STATE_DRAW;

  //Model
  missionModel: MISSION_MODEL_UI;
  defaultMission: MISSION_MODEL_UI = {
    missionType: undefined,
    airResources: [], /*airVehicle.id*/
    location: {lon: undefined, lat: undefined, alt: 0},
    polygon: [],
    polyline: [],
    frs: [],
    frIds: [],
    communicationType: undefined,
    missionDetails: {
      azimuth: 0,
      distance: null,
      scan: {
        speed: undefined,
        overlapPercent: null,
        cameraFov: null
      },
      yawOrientation: this.yawOrientationTypes[0],
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
              @Inject(MAT_DIALOG_DATA) public data: { title: string, missionType?: MISSION_TYPE, airVehicle?: AV_DATA_UI, idBlob?: string }) {
    this.initMissionModel();

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

  private initMissionModel = () => {
    if (this.data.hasOwnProperty('missionType') && this.data.hasOwnProperty('airVehicle')) {
      this.defaultMission.airResources.push(this.data.airVehicle.id);
      this.defaultMission.missionType = this.data.missionType;
      this.defaultDisabledFields.airResources = false;
      this.defaultDisabledFields.commType = false;
      this.defaultDisabledFields.location = false;
      this.setStep(2);
      this.missionModel = _.cloneDeep(this.defaultMission);
      this.selectedAirVehicles = [this.data.airVehicle];
      this.isDisabledFields = _.cloneDeep(this.defaultDisabledFields);
    } else {
      this.missionModel = _.cloneDeep(this.defaultMission);
      this.selectedAirVehicles = [];
      this.isDisabledFields = _.cloneDeep(this.defaultDisabledFields);
    }
  };

  setStep(index: number) {
    this.step = index;
  }

  nextStep(missionField: MISSION_FIELDS) {
    this.step++;
    switch (missionField) {
      case MISSION_FIELDS.missionType: {
        this.isDisabledFields.airResources = false;
        break;
      }
      case MISSION_FIELDS.airResources: {
        if (this.missionModel.missionType === MISSION_TYPE.CommRelay) {
          this.isDisabledFields.commType = false;
        } else {
          this.isDisabledFields.location = false;
        }
        break;
      }
      case MISSION_FIELDS.location: {
          this.isDisabledFields.missionDetails = false;
        this.applicationService.stateDraw = STATE_DRAW.notDraw;
        this.mapGeneralService.changeCursor(false);
        // todo:
        break;
      }
      case MISSION_FIELDS.commType: {
        this.isDisabledFields.commArg = false;
        break;
      }
      case MISSION_FIELDS.commArg: {
        this.isDisabledFields.description = false;
        this.applicationService.stateDraw = STATE_DRAW.notDraw;
        this.mapGeneralService.changeCursor(false);
        //todo:
        break;
      }
      case MISSION_FIELDS.missionDetails: {
        this.isDisabledFields.description = false;
        break;
      }
      case MISSION_FIELDS.description: {
        this.isDisabledFields.comments = false;
        break;
      }
      case MISSION_FIELDS.comments: {

        break;
      }
    }
  }

  onClickMissionType = (step: number) => {
    this.setStep(step);
  };

  onChooseMission = (missionType: MISSION_TYPE) => {
    this.initMissionModel();
    this.clearMap();
    this.missionModel.missionType = missionType;
  };

  onChangeComments = (comments: COMMENT[]) => {
    this.missionModel.comments = comments;
  };

  onChooseAirVehicle = (airVehicle: AV_DATA_UI) => {
    // if (this.missionModel.missionType === MISSION_TYPE.CommRelay) {
    //   const index = this.missionModel.airResources.findIndex(d => d === airVehicle.id);
    //   if (index !== -1) {
    //     this.missionModel.airResources.splice(index, 1);
    //     this.selectedAirVehicles.splice(index, 1);
    //   } else {
    //     this.missionModel.airResources.push(airVehicle.id);
    //     this.selectedAirVehicles.push(airVehicle);
    //   }
    // } else {
      this.missionModel.airResources = [];
      this.selectedAirVehicles = [];
      this.missionModel.airResources.push(airVehicle.id);
      this.selectedAirVehicles.push(airVehicle);
    // }
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

  checkIfSelectedLocation = (missionType: MISSION_TYPE): boolean => {
    let res = false;
    switch (missionType) {
      case MISSION_TYPE.Observation: {
        //POINT
        if (this.missionModel.location && this.missionModel.location.hasOwnProperty('lon') &&
          this.missionModel.location.hasOwnProperty('lat') &&
          (this.missionModel.location.lon === undefined || this.missionModel.location.lat === undefined)) {
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
        // FR Table
        if (this.missionModel.frs.length === 0 && this.data.idBlob === undefined) {
          res = true;
        }
        break;
      }
      case MISSION_TYPE.Delivery: {
        //TODO: Cargo POINT
        // if () {
        res = true;
        // }
        break;
      }
      case undefined : {
        res = true;
        break;
      }
    }
    return res;
  };

  checkIfSelectedCommArgs = (missionType: MISSION_TYPE): boolean => {
    let res = false;
    switch (missionType) {
      case MISSION_TYPE.CommRelay: {
        //Comm
        if (this.missionModel.communicationType === undefined) {
          res = true;
        }
        if (this.missionModel.communicationType === COMM_RELAY_TYPE.Fixed &&
          this.missionModel.location && this.missionModel.location.hasOwnProperty('lon') &&
          this.missionModel.location.hasOwnProperty('lat') &&
          (this.missionModel.location.lon === undefined || this.missionModel.location.lat === undefined)) {
          res = true;
        } else if (this.missionModel.communicationType === COMM_RELAY_TYPE.Area &&
          this.missionModel.polygon.length === 0) {
          res = true;
        } else if (this.missionModel.communicationType === COMM_RELAY_TYPE.Follow &&
          this.missionModel.frs.length === 0) {
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

  checkIfSelectedMissionDetails = (missionType: MISSION_TYPE): boolean => {
    let res: boolean = false;
    if (missionType === MISSION_TYPE.Scan) {
      if (this.missionModel.missionDetails.scan.cameraFov === null ||
        this.missionModel.missionDetails.scan.overlapPercent === null ||
        this.missionModel.missionDetails.scan.speed === undefined) {
        res = true;
      }
    } else if (missionType !== MISSION_TYPE.Patrol) {
      if (this.missionModel.missionDetails.distance === null || this.missionModel.missionDetails.azimuth === null) {
        res = true;
      }
    }
    return res;
  };

  onClickLocation = (missionType: MISSION_TYPE) => {
    this.setStep(2);
    switch (missionType) {
      case MISSION_TYPE.Observation: {
        //POINT
        if (this.missionModel.location && this.missionModel.location.hasOwnProperty('lon') &&
          this.missionModel.location.hasOwnProperty('lat') &&
          (this.missionModel.location.lon === undefined || this.missionModel.location.lat === undefined)) {
        this.missionModel.location = {lon: undefined, lat: undefined, alt: 0};
        this.locationService.deleteLocationPointTemp('tmp' + '0');
        this.missionModel.polygon = [];
        this.polygonService.deletePolygonManually('tmp' + '0');
        this.missionModel.polyline = [];
        this.polylineService.deletePolylineManually('tmp' + '0');
        // toaster
        this.customToasterService.info({message: 'Click on map to set the event\'s location', title: 'location'});
        //draw
        this.applicationService.stateDraw = STATE_DRAW.drawLocationPoint;
        this.mapGeneralService.changeCursor(true);
        }
        break;
      }
      case MISSION_TYPE.Patrol: {
        if (this.missionModel.polyline.length <= 0) {
          //Polyline
          this.missionModel.location = {lon: undefined, lat: undefined, alt: 0};
          this.locationService.deleteLocationPointTemp('tmp' + '0');
          this.missionModel.polygon = [];
          this.polygonService.deletePolygonManually('tmp' + '0');
          this.missionModel.polyline = [];
          this.polylineService.deletePolylineManually('tmp' + '0');
          // toaster
          this.customToasterService.info(
            {message: 'Click minimum 2 points to set a polyline. Click double click to finish', title: 'polyline'});
          //draw
          this.applicationService.stateDraw = STATE_DRAW.drawPolyline;
          this.mapGeneralService.changeCursor(true);
        }
        break;
    }
      case MISSION_TYPE.Scan: {
        if (this.missionModel.polygon.length <= 0) {
          //Polygon
          this.missionModel.location = {lon: undefined, lat: undefined, alt: 0};
          this.locationService.deleteLocationPointTemp('tmp' + '0');
          this.missionModel.polygon = [];
          this.polygonService.deletePolygonManually('tmp' + '0');
          this.missionModel.polyline = [];
          this.polylineService.deletePolylineManually('tmp' + '0');
          // toaster
          this.customToasterService.info(
            {message: 'Click minimum 3 points to set a polygon. Click double click to finish', title: 'polygon'});
          //draw
          this.applicationService.stateDraw = STATE_DRAW.drawPolygon;
          this.mapGeneralService.changeCursor(true);
        } else {
        //   todo edit
        }
        break;
      }
      case MISSION_TYPE.Servoing: {
        //FR Table
        break;
      }
    }
  };

  onEdit = (missionType: MISSION_TYPE, communicationType?: COMM_RELAY_TYPE) => {
    switch (missionType) {
      case MISSION_TYPE.Observation: {
        if (this.missionModel.location && this.missionModel.location.hasOwnProperty('lon') &&
          this.missionModel.location.hasOwnProperty('lat') &&
          (this.missionModel.location.lon !== undefined || this.missionModel.location.lat !== undefined)) {
          //POINT
          this.missionModel.location = {lon: undefined, lat: undefined, alt: 0};
          this.locationService.deleteLocationPointTemp('tmp' + '0');
          // toaster
          this.customToasterService.info({message: 'Click on map to set the event\'s location', title: 'location'});
          //draw
          this.applicationService.stateDraw = STATE_DRAW.drawLocationPoint;
          this.mapGeneralService.changeCursor(true);
        }
        break;
      }
      case MISSION_TYPE.Patrol: {
        if (this.missionModel.polyline.length > 0) {
          //Polyline
          this.missionModel.polyline = [];
          this.polylineService.deletePolylineManually('tmp' + '0');
          // toaster
          this.customToasterService.info(
            {message: 'Click minimum 2 points to set a polyline. Click double click to finish', title: 'polyline'});
          //draw
          this.applicationService.stateDraw = STATE_DRAW.drawPolyline;
          this.mapGeneralService.changeCursor(true);
        }
        break;
    }
      case MISSION_TYPE.Scan: {
        if (this.missionModel.polygon.length > 0) {
          //Polygon
          this.missionModel.polygon = [];
          this.polygonService.deletePolygonManually('tmp' + '0');
          // toaster
          this.customToasterService.info(
            {message: 'Click minimum 3 points to set a polygon. Click double click to finish', title: 'polygon'});
          //draw
          this.applicationService.stateDraw = STATE_DRAW.drawPolygon;
          this.mapGeneralService.changeCursor(true);
        }
        break;
      }
      case MISSION_TYPE.Servoing: {
        //FR Table
        break;
      }
      case MISSION_TYPE.CommRelay: {
        switch (communicationType) {
          case COMM_RELAY_TYPE.Fixed: {
            if (this.missionModel.location && this.missionModel.location.hasOwnProperty('lon') &&
              this.missionModel.location.hasOwnProperty('lat') &&
              (this.missionModel.location.lon !== undefined || this.missionModel.location.lat !== undefined)) {
              //POINT
              this.missionModel.location = {lon: undefined, lat: undefined, alt: 0};
              this.locationService.deleteLocationPointTemp('tmp' + '0');
              this.missionModel.polygon = [];
              this.polygonService.deletePolygonManually('tmp' + '0');
              // toaster
              this.customToasterService.info({
                message: 'Click on map to set the comm mission location',
                title: 'location'
              });
              //draw
              this.applicationService.stateDraw = STATE_DRAW.drawLocationPoint;
              this.mapGeneralService.changeCursor(true);
            }
            break;
          }
          case COMM_RELAY_TYPE.Area: {
            if (this.missionModel.polygon.length > 0) {
              //Polygon
              this.missionModel.polygon = [];
              this.polygonService.deletePolygonManually('tmp' + '0');
              // toaster
              this.customToasterService.info(
                {message: 'Click minimum 3 points to set a polygon. Click double click to finish', title: 'polygon'});
              //draw
              this.applicationService.stateDraw = STATE_DRAW.drawPolygon;
              this.mapGeneralService.changeCursor(true);
            }
            break;
          }
          case COMM_RELAY_TYPE.Follow: {
            //FR Table
            break;
          }
        }
        break;
      }
    }
  };

  onClickCommunicationArg = (communicationType: COMM_RELAY_TYPE) => {
    this.setStep(3);
    switch (communicationType) {
      case COMM_RELAY_TYPE.Fixed: {
        if (this.missionModel.location && this.missionModel.location.hasOwnProperty('lon') &&
          this.missionModel.location.hasOwnProperty('lat') &&
          (this.missionModel.location.lon === undefined || this.missionModel.location.lat === undefined)) {
          //POINT
          this.missionModel.location = {lon: undefined, lat: undefined, alt: 0};
          this.locationService.deleteLocationPointTemp('tmp' + '0');
          this.missionModel.polygon = [];
          this.polygonService.deletePolygonManually('tmp' + '0');
          // toaster
          this.customToasterService.info({message: 'Click on map to set the comm mission location', title: 'location'});
          //draw
          this.applicationService.stateDraw = STATE_DRAW.drawLocationPoint;
          this.mapGeneralService.changeCursor(true);
        }
        break;
      }
      case COMM_RELAY_TYPE.Area: {
        if (this.missionModel.polygon.length <= 0) {
          //Polygon
          this.missionModel.location = {lon: undefined, lat: undefined, alt: 0};
          this.locationService.deleteLocationPointTemp('tmp' + '0');
          this.missionModel.polygon = [];
          this.polygonService.deletePolygonManually('tmp' + '0');
          // toaster
          this.customToasterService.info(
            {message: 'Click minimum 3 points to set a polygon. Click double click to finish', title: 'polygon'});
          //draw
          this.applicationService.stateDraw = STATE_DRAW.drawPolygon;
          this.mapGeneralService.changeCursor(true);
        }
        break;
      }
      case COMM_RELAY_TYPE.Follow: {
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

  onChooseFromCamera = (airVehicles) => {
    this.onViewLiveVideo(airVehicles[0]);
    this.onNoClick();
  };

  onViewLiveVideo = (airVehicle: AV_DATA_UI) => {
    this.applicationService.selectedHeaderPanelButton = HEADER_BUTTONS.liveVideo;
    // open panel
    this.applicationService.screen.showVideo = true;
    this.applicationService.selectedWindow = VIDEO_OR_MAP.map;
    //close others
    this.applicationService.screen.showLeftPanel = false;
    this.applicationService.screen.showMissionControl = false;
    this.applicationService.screen.showSituationPicture = false;

    this.applicationService.selectedAirVehicle = airVehicle;
  };

  onUpdateFRs = (frIds: string[]) => {
    if (frIds && Array.isArray(frIds)) {
      this.missionModel.frIds = frIds;
      const frs = [];
      this.missionModel.frIds.forEach((id: string) => {
        const assignee: FR_DATA_UI = this.frService.getFRById(id);
        frs.push(assignee);
      });
      this.missionModel.frs = frs;
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
    this.isDisabledFields = _.cloneDeep(this.defaultDisabledFields);
    this.clearMap();
  };

  clearMap = () => {
    this.applicationService.stateDraw = STATE_DRAW.notDraw;
    this.mapGeneralService.changeCursor(false);
    this.locationService.deleteLocationPointTemp('tmp' + '0');
    this.polygonService.deletePolygonManually('tmp' + '0');
    this.polylineService.deletePolylineManually('tmp' + '0');
    this.applicationService.isDialogOpen = false;
  };


}
