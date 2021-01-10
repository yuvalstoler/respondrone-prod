import {Cartesian2} from 'angular-cesium';
import {
  AV_DATA_UI,
  EVENT_DATA_UI,
  FR_DATA_UI,
  GEOGRAPHIC_INSTRUCTION, ICON_STYLES,
  POINT, POINT3D, POLYGON_STYLES, POLYLINE_STYLES,
  REPORT_DATA_UI
} from '../../../classes/typings/all.typings';

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

export enum VIDEO_OR_MAP {
  video = 'video',
  map = 'map'
}

export type DISPLAY_ON_SCREEN = {
  showLeftPanel: boolean;
  showRightPanel: boolean;
  showGrandResources: boolean,
  showAirResources: boolean,
  showSituationPicture: boolean;
  showMissionControl: boolean;
  showViewMedia: boolean;
  showVideo: boolean,
  showVideoCanvas: boolean,

  showFRLocations: boolean,
  showReports: boolean,
  showEvents: boolean,
  showTasks: boolean,
  showMissions: boolean,
  showMissionPlans: boolean,
  showUAV: boolean,
  showNFZ: boolean,
  showGraphicOverlays: boolean,
};

export enum VIEW_LIST {
  showFRLocations = 'FR Location',
  showReports = 'Reports',
  showEvents = 'Events',
  showTasks = 'Tasks',
  showMissions = 'Missions',
  showMissionPlans = 'Mission plans',
  showUAV = 'UAV locations',
  showNFZ = 'NFZ',
  showGraphicOverlays = 'Graphic overlays',
  showGrandResources = 'Ground Resources Panel',
  showAirResources = 'Air Resources Panel',
}

export enum LEFT_PANEL_ICON {
  collapse = 'arrow_forward_ios',
  expand = 'arrow_back_ios'
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
  pointLatLng: POINT3D,
  distance?: number,
  object?: OPTIONS_ENTITY
};

export enum TYPE_OBJECTS_CE {
  locationPointCE = 'locationPointCE',
  // billboardCE = 'billboardCE',
  iconCE = 'iconCE',
  // iconLabelCE = 'iconLabelCE',
  polygonCE = 'polygonCE',
  // labelPolygonCE = 'labelPolygonCE',
  polylineCE = 'polylineCE',
  arrowPolylineCE = 'arrowPolylineCE'
}

export enum ITEM_TYPE {
  missionRequest = 'missionRequest',
  report = 'report',
  event = 'event',
  task = 'task',
  mission = 'mission',
  missionRoute = 'missionRoute',
  fr = 'fr',
  av = 'av',
}

export type OPTIONS_ENTITY = {
  hoverText: string,
  data?: any,
  type?: ITEM_TYPE
};



export type ICON_DATA = {
  id: string,
  heading?: number,
  modeDefine: {
    styles: ICON_STYLES
  },
  isShow: boolean,
  location: POINT3D
  optionsData: any,
  type: ITEM_TYPE
};


export type POLYGON_DATA = {
  id: string,
  modeDefine: {
    styles: POLYGON_STYLES
  },
  isShow: boolean,
  polygon: POINT3D[],
  optionsData: any,
  type: ITEM_TYPE
};



export type POLYLINE_DATA = {
  id: string,
  modeDefine: {
    styles: POLYLINE_STYLES
  },
  isShow: boolean,
  polyline: POINT3D[],
  optionsData: any,
  type: ITEM_TYPE
};



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
  UAVEnergy = 'UAV energy'
}
export enum MISSION_FIELDS {
  missionType = 'missionType',
  airResources = 'airResources',
  location = 'location',
  commType = 'commType',
  commArg = 'commArg',
  missionDetails = 'missionDetails',
  description = 'description',
  comments = 'comments'
}
