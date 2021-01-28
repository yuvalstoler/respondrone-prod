import { Injectable } from '@angular/core';
import {
  ASYNC_RESPONSE,
  CREDENTIALS,
  USER_DATA_UI
} from '../../../../../../classes/typings/all.typings';
import {ConnectionService} from '../connectionService/connection.service';
import * as _ from 'lodash';
import {Router} from '@angular/router';
import {ApplicationService} from '../applicationService/application.service';
import {CustomToasterService} from '../toasterService/custom-toaster.service';
import {API_GENERAL, WS_API} from '../../../../../../classes/dataClasses/api/api_enums';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  // sessionStorage = (window).sessionStorage;
  loginEvent$: BehaviorSubject<string> = new BehaviorSubject(undefined);
  isSpinner: boolean = false;
  userData: USER_DATA_UI = {name: undefined, id: undefined};

  constructor(private connectionService: ConnectionService,
              private router: Router,
              private applicationService: ApplicationService,
              private customToasterService: CustomToasterService) {
  }
  // ---------------
  public login = (credentials?: CREDENTIALS, headers?): Promise<ASYNC_RESPONSE<USER_DATA_UI>> => {
    return new Promise((resolve, reject) => {
      this.isSpinner = true;
      this.connectionService.post(`/${API_GENERAL.general}${WS_API.login}`, credentials)
        .then((loginRes: ASYNC_RESPONSE<USER_DATA_UI>) => {
          if (loginRes.success && loginRes.data) {
            this.updateDataOnLogin(loginRes.data);
            this.isSpinner = false;
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
  // ---------------
  public updateDataOnLogin = (userData: USER_DATA_UI) => {
    this.userData.id = userData.id;
    this.userData.name = userData.name;

    localStorage.setItem('respondroneToken', userData.token);
    this.loginEvent$.next(userData.chatPassword);
  }
  // ---------------
  public isLoggedIn = () => {
    const token = localStorage.getItem('respondroneToken');
    if (token) {
      const data: CREDENTIALS = {token: token};
      return this.connectionService.postObservable(`/${API_GENERAL.general}${WS_API.login}`, data);
    }
    else {
      return new Observable<Object>((observer) => {
        observer.next({success: false});
      });
    }
  };
  // ---------------
  public logout = (): void => {
    localStorage.clear();
    this.router.navigateByUrl('/login');
  }
  // ---------------
  public getUserName = () => {
    return this.userData.name;
  }

  public getUserId = () => {
    return this.userData.id;
  }
}
