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
  showSituationPicture: boolean;
  showMissionControl: boolean;
};

export enum LEFT_PANEL_ICON {
  minimize = 'arrow_forward_ios',
  expand = 'close'
}

export enum STATE_DRAW {
  notDraw = 'notDraw',
  drawLocationPoint = 'drawLocationPoint',
  editLocationPoint = 'editLocationPoint',
  drawPolygon = 'drawPolygon'
}

export type EVENT_LISTENER_DATA = {
  type: string,
  pointPX: Cartesian2,
  pointLatLng: POINT,
  distance?: number
};

export enum TYPE_OBJECTS_CE {
  locationPointCE = 'locationPointCE',
  billboardCE = 'billboardCE',
  iconCE = 'iconCE',
  polygonCE = 'polygonCE',
  labelPolygonCE = 'labelPolygonCE'
}

