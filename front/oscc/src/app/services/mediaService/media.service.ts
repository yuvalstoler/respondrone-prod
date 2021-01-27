import { Injectable } from '@angular/core';
import {ConnectionService} from '../connectionService/connection.service';
import {HttpEventType, HttpHeaders} from '@angular/common/http';
import {FILE_FS_DATA} from '../../../../../../classes/typings/all.typings';
import {API_GENERAL, WS_API} from '../../../../../../classes/dataClasses/api/api_enums';


@Injectable({
  providedIn: 'root'
})
export class MediaService {


  constructor(private connectionService: ConnectionService) {

  }
  // ----------------------
  public uploadFile = () => {

  };
  // ----------------------
  public deleteFile = (data: FILE_FS_DATA) => {
    return new Promise((resolve, reject) => {
      this.connectionService.post(`/${API_GENERAL.general}${WS_API.removeFile}`, data)
        .then((res: any) => {
            resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

}
