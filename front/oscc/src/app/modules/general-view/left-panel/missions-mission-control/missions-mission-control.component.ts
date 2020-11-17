import {Component, OnInit, ViewChild} from '@angular/core';
import {
  COMM_RELAY_MISSION_REQUEST,
  COMM_RELAY_TYPE,
  DELIVERY_MISSION_REQUEST,
  FOLLOW_PATH_MISSION_REQUEST,
  LAST_ACTION,
  MISSION_MODEL_UI,
  MISSION_REQUEST_ACTION,
  MISSION_REQUEST_ACTION_OBJ,
  MISSION_REQUEST_DATA,
  MISSION_STATUS,
  MISSION_STATUS_UI,
  MISSION_TYPE,
  OBSERVATION_MISSION_REQUEST,
  SCAN_MISSION_REQUEST, SERVOING_MISSION_REQUEST,
  YAW_ORIENTATION
} from '../../../../../../../../classes/typings/all.typings';
import {MatDialog} from '@angular/material/dialog';
import {MissionDialogComponent} from '../../../../dialogs/mission-dialog/mission-dialog.component';
import {ApplicationService} from '../../../../services/applicationService/application.service';
import {LEFT_PANEL_ICON} from '../../../../../types';
import {MissionsTableComponent} from "./missions-situation-table/missions-table.component";
import {MissionRequestService} from "../../../../services/missionRequestService/missionRequest.service";

@Component({
  selector: 'app-missions-mission-control',
  templateUrl: './missions-mission-control.component.html',
  styleUrls: ['./missions-mission-control.component.scss']
})
export class MissionsMissionControlComponent implements OnInit {

  @ViewChild(MissionsTableComponent ) childComponent: MissionsTableComponent ;
  LEFT_PANEL_ICON = LEFT_PANEL_ICON;
  MISSION_REQUEST_ACTION = MISSION_REQUEST_ACTION;

  constructor( public dialog: MatDialog,
               public applicationService: ApplicationService,
               public missionRequestService: MissionRequestService) { }

  ngOnInit(): void {
  }

  onCreateNewMission = () => {
    this.openPanel('Create new mission request');
  };

  private openPanel = (title: string) => {
    const dialogRef = this.dialog.open(MissionDialogComponent, {
      width: '45vw',
      disableClose: true,
      data: {title: title}
    });

    dialogRef.afterClosed().subscribe((missionModel: MISSION_MODEL_UI) => {
      if (missionModel) {
        switch (missionModel.missionType) {
          case MISSION_TYPE.Observation:
            this.createObservationMission(missionModel);
            break;
          case MISSION_TYPE.Scan:
            this.createScanMission(missionModel);
            break;
          case MISSION_TYPE.Patrol:
            this.createPatrolMission(missionModel);
            break;
          case MISSION_TYPE.CommRelay:
            this.createCommRelayMission(missionModel);
            break;
          case MISSION_TYPE.Servoing:
            this.createServoingMission(missionModel);
            break;
          case MISSION_TYPE.Delivery:
            this.createDeliveryMission(missionModel);
            break;
        }
      }
    });
  };

  createObservationMission = (missionModel: MISSION_MODEL_UI) => {
    const observationMissionRequest: OBSERVATION_MISSION_REQUEST = {
      droneId: missionModel.airResources[0],
      status: MISSION_STATUS.Pending,
      observationPoint: missionModel.location,
      observationAzimuth: missionModel.missionDetails.azimuth,
      altitudeOffset: missionModel.missionDetails.distance
    };
    const missionRequest: MISSION_REQUEST_DATA = {
      id: undefined,
      missionType: MISSION_TYPE.Observation,
      lastAction: LAST_ACTION.Insert,
      version: 0,
      description: missionModel.description,
      comments: missionModel.comments,
      observationMissionRequest: observationMissionRequest,
      idView: undefined,
      time: undefined,
      createdBy: '',
      missionStatus: MISSION_STATUS_UI.Pending
    };
    this.missionRequestService.createMissionRequest(missionRequest);
  }

  createScanMission = (missionModel: MISSION_MODEL_UI) => {
    const scanMissionRequest: SCAN_MISSION_REQUEST = {
      droneId: missionModel.airResources[0],
      status: MISSION_STATUS.Pending,
      scanSpeed: missionModel.missionDetails.scan.speed,
      scanAngle: missionModel.missionDetails.azimuth,
      polygon: {coordinates: this.applicationService.point3d_to_geoPoint3d_short_arr(missionModel.polygon)},
      overlapPercent: missionModel.missionDetails.scan.overlapPercent,
      cameraFOV: missionModel.missionDetails.scan.cameraFov,
    };
    const missionRequest: MISSION_REQUEST_DATA = {
      id: undefined,
      missionType: MISSION_TYPE.Scan,
      lastAction: LAST_ACTION.Insert,
      version: 0,
      description: missionModel.description,
      comments: missionModel.comments,
      scanMissionRequest: scanMissionRequest,
      idView: undefined,
      time: undefined,
      createdBy: '',
      missionStatus: MISSION_STATUS_UI.Pending
    };
    this.missionRequestService.createMissionRequest(missionRequest);
  }

  createPatrolMission = (missionModel: MISSION_MODEL_UI) => {
    const patrolMissionRequest: FOLLOW_PATH_MISSION_REQUEST = {
      droneId: missionModel.airResources[0],
      status: MISSION_STATUS.Pending,
      yawOrientation: YAW_ORIENTATION.North,                                  // TODO
      gimbalAzimuth: missionModel.missionDetails.azimuth,
      polyline: {coordinates: this.applicationService.point3d_to_geoPoint3d_short_arr(missionModel.polyline)},
    };
    const missionRequest: MISSION_REQUEST_DATA = {
      id: undefined,
      missionType: MISSION_TYPE.Patrol,
      lastAction: LAST_ACTION.Insert,
      version: 0,
      description: missionModel.description,
      comments: missionModel.comments,
      followPathMissionRequest: patrolMissionRequest,
      idView: undefined,
      time: undefined,
      createdBy: '',
      missionStatus: MISSION_STATUS_UI.Pending
    };
    this.missionRequestService.createMissionRequest(missionRequest);
  }

  createCommRelayMission = (missionModel: MISSION_MODEL_UI) => {
    const commRelayMissionRequest: COMM_RELAY_MISSION_REQUEST = {
      droneId: missionModel.airResources[0],
      status: MISSION_STATUS.Pending,
      commRelayType: missionModel.communicationType,
      missionData: undefined,
    };

    if (missionModel.communicationType === COMM_RELAY_TYPE.Fixed) {
      commRelayMissionRequest.missionData = {point: missionModel.location}
    }
    else if (missionModel.communicationType === COMM_RELAY_TYPE.Area) {
      commRelayMissionRequest.missionData = {area: {coordinates: this.applicationService.point3d_to_geoPoint3d_short_arr(missionModel.polygon)},}
    }
    if (missionModel.communicationType === COMM_RELAY_TYPE.Follow) {
      commRelayMissionRequest.missionData = {FRs: missionModel.frIds}
    }
    const missionRequest: MISSION_REQUEST_DATA = {
      id: undefined,
      missionType: MISSION_TYPE.CommRelay,
      lastAction: LAST_ACTION.Insert,
      version: 0,
      description: missionModel.description,
      comments: missionModel.comments,
      commRelayMissionRequest: commRelayMissionRequest,
      idView: undefined,
      time: undefined,
      createdBy: '',
      missionStatus: MISSION_STATUS_UI.Pending
    };
    this.missionRequestService.createMissionRequest(missionRequest);
  }

  createServoingMission = (missionModel: MISSION_MODEL_UI) => {
    const servoingMissionRequest: SERVOING_MISSION_REQUEST = {
      droneId: missionModel.airResources[0],
      status: MISSION_STATUS.Pending,
      targetId: ''                                      // TODO
    };
    const missionRequest: MISSION_REQUEST_DATA = {
      id: undefined,
      missionType: MISSION_TYPE.Servoing,
      lastAction: LAST_ACTION.Insert,
      version: 0,
      description: missionModel.description,
      comments: missionModel.comments,
      servoingMissionRequest: servoingMissionRequest,
      idView: undefined,
      time: undefined,
      createdBy: '',
      missionStatus: MISSION_STATUS_UI.Pending
    };
    this.missionRequestService.createMissionRequest(missionRequest);
  }

  createDeliveryMission = (missionModel: MISSION_MODEL_UI) => {
    const deliveryMissionRequest: DELIVERY_MISSION_REQUEST = {
      droneId: missionModel.airResources[0],
      status: MISSION_STATUS.Pending,
    };
    const missionRequest: MISSION_REQUEST_DATA = {
      id: undefined,
      missionType: MISSION_TYPE.Delivery,
      lastAction: LAST_ACTION.Insert,
      version: 0,
      description: missionModel.description,
      comments: missionModel.comments,
      deliveryMissionRequest: deliveryMissionRequest,
      idView: undefined,
      time: undefined,
      createdBy: '',
      missionStatus: MISSION_STATUS_UI.Pending
    };
    this.missionRequestService.createMissionRequest(missionRequest);
  }


  onMissionRequestAction = (action: MISSION_REQUEST_ACTION) => {
    if (this.applicationService.selectedMissionRequests[0]) {
      const data: MISSION_REQUEST_ACTION_OBJ = {
        missionRequestId: this.applicationService.selectedMissionRequests[0].id,
        action: action
      }
      this.missionRequestService.sendMissionRequestAction(data);
    }
  };

  getFilter = (event) => {
    this.childComponent.applyFilter(event);
  };

}
