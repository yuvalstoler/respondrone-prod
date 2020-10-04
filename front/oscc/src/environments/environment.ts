// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false
};


// =================   localhost   ===================
const baseUrl = 'http://localhost:6000';

export const WEB_SERVER = `${baseUrl}/api`;

export const SOCKET_CONFIG = {
  url: baseUrl,

  options: {}
};

export const websocketOutTimeInterval = 3000;
export const websocketCameraJoystickRoom = 'ui_proxy_setCamera';
export const websocketFlightJoystickRoom = 'ui_proxy_setVelocity';

export const mapDefaultPosition =  {lat: 32.637, lon: 35.052}; // [32.03529, 34.78821];
export const mapMinZoom = 5;
export const mapMaxZoom = 18;
export const mapZoom = 16;
