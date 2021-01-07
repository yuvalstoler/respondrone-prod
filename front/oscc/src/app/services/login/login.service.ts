import { Injectable } from '@angular/core';
import {
  ASYNC_RESPONSE,
  CREDENTIALS,
  LOGIN_RESPONSE, USER_DATA_UI
} from '../../../../../../classes/typings/all.typings';
import {ConnectionService} from '../connectionService/connection.service';
import * as _ from 'lodash';
import {Router} from '@angular/router';
import {ApplicationService} from '../applicationService/application.service';
import {CustomToasterService} from '../toasterService/custom-toaster.service';
import {API_GENERAL, WS_API} from '../../../../../../classes/dataClasses/api/api_enums';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  // sessionStorage = (window).sessionStorage;
  isSpinner: boolean = false;
  userData: USER_DATA_UI = {name: undefined, id: undefined};

  constructor(private connectionService: ConnectionService,
              private router: Router,
              private applicationService: ApplicationService,
              private customToasterService: CustomToasterService) {

    if (this.isLoggedIn()) {
      this.userData.name = localStorage.getItem('name');
      this.userData.id = localStorage.getItem('id');
    }

  }

  public login = (credentials?: CREDENTIALS, headers?): Promise<ASYNC_RESPONSE<LOGIN_RESPONSE>> => {
    return new Promise((resolve, reject) => {
      this.isSpinner = true;
      this.connectionService.post(`/${API_GENERAL.general}${WS_API.login}`, credentials)
        .then((loginRes: ASYNC_RESPONSE<LOGIN_RESPONSE>) => {
          if (loginRes.success && loginRes.data.token) {
            localStorage.setItem('token', loginRes.data.token);
            this.isSpinner = false;

            this.userData = loginRes.data.userData || {name: undefined, id: undefined};
            localStorage.setItem('name', this.userData.name);
            localStorage.setItem('id', this.userData.id);

            this.router.navigateByUrl('/general-view');
            resolve(loginRes);
          } else {
            this.isSpinner = false;
            resolve(loginRes);
          }
        })
        .catch(err => {
          this.isSpinner = false;
          reject(false);
        });
    });
  };

  public isLoggedIn = (): boolean => {
    return localStorage.getItem('token') !== null;
  };

  public logout = (): void => {
    localStorage.clear();
    this.router.navigateByUrl('/login');
  }

  public getUserName = () => {
    return this.userData.name;
  }

  public getUserId = () => {
    return this.userData.id;
  }
}
