import { Injectable } from '@angular/core';
import {ConnectionService} from '../connectionService/connection.service';
import {HttpEventType, HttpHeaders} from '@angular/common/http';
import {FILE_FS_DATA} from '../../../../../../classes/typings/all.typings';


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
      this.connectionService.post('/api/removeFile', data)
        .then((res: any) => {
            resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

}
