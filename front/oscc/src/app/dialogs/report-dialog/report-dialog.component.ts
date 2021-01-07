import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {
  COMMENT, EVENT_DATA_UI,
  FILE_FS_DATA,
  GEOPOINT3D, GEOPOINT3D_SHORT, LINKED_EVENT_DATA, LOCATION_NAMES,
  LOCATION_TYPE,
  PRIORITY,
  REPORT_DATA_UI,
  SOURCE_TYPE
} from '../../../../../../classes/typings/all.typings';
import {ApplicationService} from '../../services/applicationService/application.service';
import {LocationService} from '../../services/locationService/location.service';
import {ReportService} from '../../services/reportService/report.service';
import {CustomToasterService} from '../../services/toasterService/custom-toaster.service';
import {EventService} from '../../services/eventService/event.service';
import {HEADER_BUTTONS, STATE_DRAW} from '../../../types';
import * as _ from 'lodash';
import {MapGeneralService} from '../../services/mapGeneral/map-general.service';
import {MediaService} from '../../services/mediaService/media.service';
import {LoginService} from "../../services/login/login.service";

@Component({
  selector: 'app-report-dialog',
  templateUrl: './report-dialog.component.html',
  styleUrls: ['./report-dialog.component.scss']
})
export class ReportDialogComponent {

  reportModel: REPORT_DATA_UI;
  types = this.applicationService.typesConfig.reportTypes;
  priorities = Object.values(PRIORITY);
  locations = Object.values([LOCATION_NAMES.noLocation, LOCATION_NAMES.address, LOCATION_NAMES.locationPoint]);
  comment = '';

  defaultReport: REPORT_DATA_UI = {
    source: SOURCE_TYPE.OSCC,
    createdBy: this.loginService.getUserName(),
    time: undefined,
    type: this.types[0],
    priority: this.priorities[0],
    description: '',
    locationType: LOCATION_TYPE.none,
    location: {longitude: undefined, latitude: undefined, altitude: 0},
    address: '',
    eventIds: [],
    comments: [],
    events: [],
    media: [],
    idView: '',
    modeDefine: undefined,
    mediaFileIds: undefined
  };

  LOCATION_TYPE = LOCATION_TYPE;
  LOCATION_NAMES = LOCATION_NAMES;

  locationTypeByName = {
    [LOCATION_NAMES.noLocation]: LOCATION_TYPE.none,
    [LOCATION_NAMES.address]: LOCATION_TYPE.address,
    [LOCATION_NAMES.locationPoint]: LOCATION_TYPE.locationPoint,
    [LOCATION_NAMES.polygon]: LOCATION_TYPE.polygon,
  };

  constructor(public applicationService: ApplicationService,
              public locationService: LocationService,
              public reportService: ReportService,
              public customToasterService: CustomToasterService,
              public eventService: EventService,
              public mediaService: MediaService,
              public mapGeneralService: MapGeneralService,
              public dialogRef: MatDialogRef<ReportDialogComponent>,
              private loginService: LoginService,
              @Inject(MAT_DIALOG_DATA) public data: {title: string}) {
    this.initReportModel();

    // add location on panel
    this.locationService.locationPoint$.subscribe(latlon => {
      if (this.applicationService.stateDraw === STATE_DRAW.drawLocationPoint || this.applicationService.stateDraw === STATE_DRAW.editLocationPoint) {
        this.reportModel.location = {longitude: latlon.lon, latitude: latlon.lat, altitude: 0};
      }
    });
  }

  private initReportModel = () => {
    if (this.applicationService.selectedReports.length === 1) {
      this.reportModel = _.cloneDeep(this.applicationService.selectedReports[0]);
      this.setTempObjectCE(this.applicationService.selectedReports[0]);
    } else {
      this.reportModel = _.cloneDeep(this.defaultReport);
    }
  };

  setTempObjectCE = (report: REPORT_DATA_UI) => {
    switch (report.locationType) {
      case LOCATION_TYPE.none: {
        this.reportService.tempReportObjectCE = {type: LOCATION_TYPE.none, objectCE: undefined, id: report.id, report};
        break;
      }
      case LOCATION_TYPE.address: {
        this.reportService.tempReportObjectCE = {type: LOCATION_TYPE.address, objectCE: report.address, id: report.id, report};
        break;
      }
      case LOCATION_TYPE.locationPoint: {
        this.reportService.tempReportObjectCE = {type: LOCATION_TYPE.locationPoint, objectCE: report.location, id: report.id, report};
        break;
      }
    }
  };

  onChangeLocation = (location: string) => {
    if (this.reportService.tempReportObjectCE !== undefined) {
      this.reportService.hideObjectOnMap(this.reportService.tempReportObjectCE);
    }
    if (location === LOCATION_NAMES.noLocation) {
      this.reportModel.locationType = LOCATION_TYPE.none;
      this.reportModel.location = {longitude: undefined, latitude: undefined, altitude: 0};
      this.reportModel.address = '';
      this.locationService.deleteLocationPointTemp('tmp' + '0');

    } else if (location === LOCATION_NAMES.address) {
      this.reportModel.address = '';
      // this.reportModel.location = {longitude: undefined, latitude: undefined, altitude: 0};
      this.reportModel.locationType = LOCATION_TYPE.address;
      this.applicationService.stateDraw = STATE_DRAW.notDraw;
      this.mapGeneralService.changeCursor(false);
      this.locationService.deleteLocationPointTemp('tmp' + '0');

    } else if (location === LOCATION_NAMES.locationPoint) {
      this.reportModel.location = {longitude: undefined, latitude: undefined, altitude: 0};
      this.customToasterService.info({message: 'Click on map to set the report\'s location', title: 'location'});
      this.reportModel.address = '';
      // if (this.reportModel.location.latitude === undefined && this.reportModel.location.longitude === undefined) {
        this.reportModel.locationType = LOCATION_TYPE.locationPoint;
        this.applicationService.stateDraw = STATE_DRAW.drawLocationPoint;
      this.mapGeneralService.changeCursor(true);
      // }
    }
  };

  locationChanged = (event) => {
    if (event.target.value !== '') {
      this.applicationService.stateDraw = STATE_DRAW.notDraw;
      this.mapGeneralService.changeCursor(false);
      // this.locationService.removeBillboard();
      if (this.reportModel.location.latitude !== undefined && this.reportModel.location.longitude !== undefined) {
        const locationPoint: GEOPOINT3D_SHORT = {
          lon: this.reportModel.location.longitude,
          lat: this.reportModel.location.latitude,
          alt: 0
        };
        this.locationService.createOrUpdateLocationTemp(locationPoint);
        this.applicationService.stateDraw = STATE_DRAW.editLocationPoint;
        this.mapGeneralService.changeCursor(true);
      }
    }
  };

  onAddMedia = (newMedia: FILE_FS_DATA) => {
    this.reportModel.media.unshift(newMedia);
  };

  onDeleteMedia = (newMedia: FILE_FS_DATA) => {
    const index = this.reportModel.media.findIndex((data: FILE_FS_DATA) => data.id === newMedia.id);
    if (index !== -1) {
      this.reportModel.media.splice(index, 1);
    }
  };

  onNoClick(): void {
    if (this.reportService.tempReportObjectCE && this.reportService.tempReportObjectCE.hasOwnProperty('report')) {
      this.reportService.showReportOnMap(this.reportService.tempReportObjectCE.report);
    }
    if (!this.reportModel.id) {
      this.reportModel.media.forEach((mediaData) => {
        this.mediaService.deleteFile(mediaData);
      });
    }
    this.clearPanel();
    this.dialogRef.close(false);
  }

  onCreateClick(): void {
    this.dialogRef.close(this.reportModel);
    this.clearPanel();
  }

  clearPanel = () => {
    this.applicationService.selectedHeaderPanelButton = HEADER_BUTTONS.situationPictures;
    this.reportModel = _.cloneDeep(this.defaultReport);
    this.applicationService.stateDraw = STATE_DRAW.notDraw;
    this.mapGeneralService.changeCursor(false);
    this.locationService.deleteLocationPointTemp('tmp' + '0');
    this.applicationService.isDialogOpen = false;
  };

  onUpdateLinkedEvents = (linkedEventIds: string[]) => {
    if (linkedEventIds && Array.isArray(linkedEventIds)) {
      this.reportModel.eventIds = linkedEventIds;
      const linkedEvents = [];
      this.reportModel.eventIds.forEach((eventId: string) => {
        const linkedEvent: LINKED_EVENT_DATA = this.eventService.getLinkedEvent(eventId);
        linkedEvents.push(linkedEvent);
      });
      this.reportModel.events = linkedEvents;
    }
  };

  onChangeComments = (comments: COMMENT[]) => {
    this.reportModel.comments = comments;
  };

  getLocationDisabled = (): boolean => {
    let res = false;
    if (this.reportModel.locationType === LOCATION_TYPE.locationPoint &&
      (this.reportModel.location.latitude === undefined ||
        this.reportModel.location.longitude === undefined)) {
      res = true;
    }
    if (this.reportModel.locationType === LOCATION_TYPE.address &&
      (this.reportModel.address === undefined || this.reportModel.address === '')) {
      res = true;
    }
    return res;
  };

  getAddress = (place: any) => {
    // this.zone.run(() => this.formattedAddress = place['formatted_address']);
    if (this.reportService.tempReportObjectCE !== undefined) {
      this.reportService.hideObjectOnMap(this.reportService.tempReportObjectCE);
    }
    const geometry = place.geometry;
    if (geometry.viewport) {
      const lat = geometry.viewport.getCenter().lat();
      const lng = geometry.viewport.getCenter().lng();
      this.reportModel.location = {latitude: lat, longitude: lng, altitude: 0};
      this.reportModel.address = place['formatted_address'];
      this.locationService.createOrUpdateLocationTemp({ lat: lat, lon: lng, alt: 0 });
      this.eventService.flyToObject([lng, lat, 0]);
    }
  };

}
