import {Injectable} from '@angular/core';
import {CONNECTION_STATUS, STATUS_INDICATOR_DATA} from '../../../../../../classes/typings/all.typings';
import {SocketService} from '../socketService/socket.service';
import * as _ from 'lodash';
import {fromEvent} from 'rxjs';
import {ConnectionService} from '../connectionService/connection.service';
import {API_GENERAL, WS_API} from '../../../../../../classes/dataClasses/api/api_enums';
import {StatusMdLogic} from '../../../../../../classes/modeDefineTSSchemas/status/statusMdLogic';

@Injectable({
  providedIn: 'root'
})
export class StatusIndicatorService {

  statusData: {data: STATUS_INDICATOR_DATA} = {data: {
      webserver: {status: CONNECTION_STATUS.NA, description: ''},
      internet: {status: CONNECTION_STATUS.NA, description: ''},
      repositories: {status: CONNECTION_STATUS.NA, description: ''},
      tmm: {status: CONNECTION_STATUS.NA, description: ''},
      thales: {status: CONNECTION_STATUS.NA, description: ''},
  }};

  isConnectedToWS: boolean = false;
  isConnectedToInternet: boolean = false;

  constructor(private socketService: SocketService,
              private connectionService: ConnectionService) {
    this.socketService.connected$.subscribe(this.init);
    this.socketService.connectToRoom('webServer_statusData').subscribe(this.updateStatusData);
    this.startCheckInternetConnection();
  }
  // ---------------------
  private startCheckInternetConnection = () => {
    this.isConnectedToInternet = window.navigator.onLine;
    this.updateUIStatuses();

    fromEvent(window, 'online').subscribe(e => {
      this.isConnectedToInternet = true;
      this.updateUIStatuses();
    });

    fromEvent(window, 'offline').subscribe(e => {
      this.isConnectedToInternet = false;
      this.updateUIStatuses();
    });
  }

  // ----------------------
  private init = (isConnected: boolean = true): void => {
    if (isConnected) {
      this.getStatuses();
      this.isConnectedToWS = true;
      this.updateUIStatuses();
    }
    else {
      this.isConnectedToWS = false;
      this.updateUIStatuses();
    }
  };
  // ----------------------
  public getStatuses = (isConnected: boolean = true) => {
    if (isConnected) {
      this.connectionService.post(`/${API_GENERAL.general}${WS_API.readAllStatuses}`, {})
        .then((data) => {
          const dataResult = _.get(data, 'data', false);
          if (dataResult) {
            this.updateStatusData(dataResult);
          }
        })
        .catch(e => {
          console.log(e);
        });
    }
  };
  // ----------------------
  private updateStatusData = (data: STATUS_INDICATOR_DATA): void => {
    if (data) {
      this.statusData.data = data;
      this.updateUIStatuses();
    }
  };

  // ---------------------
  private updateUIStatuses = () => {
    this.statusData.data.webserver = {
      status: this.isConnectedToWS ? CONNECTION_STATUS.connected : CONNECTION_STATUS.disconnected,
      description: '',
    };
    this.statusData.data.internet = {
      status: this.isConnectedToInternet ? CONNECTION_STATUS.connected : CONNECTION_STATUS.disconnected,
      description: ''
    };

    this.statusData.data.modeDefine = StatusMdLogic.validate(this.statusData.data);
  }
}
