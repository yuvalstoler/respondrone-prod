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
  showLeftNarrowPanel: boolean;
  showEventPanel: boolean;
  showReportPanel: boolean;
};

export enum LEFT_PANEL_ICON {
  minimize = 'close',
  expand = 'arrow_forward_ios'
}


