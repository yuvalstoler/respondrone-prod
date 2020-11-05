import {Cartesian2} from 'angular-cesium';
import {POINT} from '../../../classes/typings/all.typings';

export type MAP<T> = { [key: string]: T };

export enum HEADER_BUTTONS {
  none = 'none',
  situationPictures = 'situationPictures',
  missionControl = 'missionControl',
  liveVideo = 'liveVideo',
  media = 'media',
  toolbox = 'toolbox',
  view = 'view'
}

export type DISPLAY_ON_SCREEN = {
  showLeftPanel: boolean;
  showRightPanel: boolean;
  showGrandResources: boolean,
  showAirResources: boolean,
  showSituationPicture: boolean;
  showMissionControl: boolean;
  showViewMedia: boolean;
};

export enum LEFT_PANEL_ICON {
  minimize = 'arrow_forward_ios',
  expand = 'close'
}

export enum STATE_DRAW {
  notDraw = 'notDraw',
  drawLocationPoint = 'drawLocationPoint',
  editLocationPoint = 'editLocationPoint',
  drawPolygon = 'drawPolygon',
  drawArrow = 'drawArrow',
  drawPolyline = 'drawPolyline'
}

export type EVENT_LISTENER_DATA = {
  type: string,
  pointPX: Cartesian2,
  pointLatLng: POINT,
  distance?: number,
  object?: OPTIONS_ENTITY
};

export enum TYPE_OBJECTS_CE {
  locationPointCE = 'locationPointCE',
  billboardCE = 'billboardCE',
  iconCE = 'iconCE',
  iconLabelCE = 'iconLabelCE',
  polygonCE = 'polygonCE',
  labelPolygonCE = 'labelPolygonCE',
  polylineCE = 'polylineCE',
  arrowPolylineCE = 'arrowPolylineCE'
}

export type OPTIONS_ENTITY = {
  description: string,
  id?: string
};

export enum VIEW_LIST {
  frLocation = 'FR Location',
  reportsLocation = 'Reports Location',
  events = 'Events',
  UAVLocationsAndRouts = 'UAV locations and routs',
  missionsPlane = 'Missions plans',
  nfz = 'NFZ',
  airResourcesPanel = 'Air Resources Panel',
  groundResourcesPanel = 'Ground Resources Panel'
}

export enum SORT_GROUND_RESOURCES {
  lastUpdate = 'Last update',
  resourceType = 'Resource Type',
  status = 'Status'
}
export enum SORT_AIR_RESOURCES {
  lastUpdate = 'Last update',
  UAVType = 'UAV type',
  status = 'Status',
  missionType = 'Mission type',
  UAVEnergy = 'UAV energy',
  payload = 'Payload'
}
