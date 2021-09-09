import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {Socket} from 'ngx-socket-io';
import {SOCKET_CONFIG} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  public connected$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private socket: Socket) {

    this.socket.disconnect();
    this.socket = new Socket(SOCKET_CONFIG);

    this.socket.on('disconnect', () => {
      this.connected$.next(false);
    });
    this.socket.on('connect', () => {
      this.connected$.next(true);
    });
  }

  public connectToRoom = (roomName: string): Observable<any> => {
    return this.socket.fromEvent<any>(roomName);
  };


  public emitSocketFunction = (wsFunctionName: string, functionData?: any): void => {
    if (functionData) {
      this.socket.emit(wsFunctionName, functionData);
    } else {
      this.socket.emit(wsFunctionName);
    }
  }
}
