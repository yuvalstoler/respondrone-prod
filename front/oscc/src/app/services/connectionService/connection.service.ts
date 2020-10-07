import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {SOCKET_CONFIG} from '../../../environments/environment';
import { timeout } from 'rxjs/operators';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConnectionService {
  serverUrl = SOCKET_CONFIG.url;

  constructor(private http: HttpClient) {

  }

  get(url: string, server = this.serverUrl): any {
    return this.http.get(server + url).toPromise();
  }

  post(url: string, body: object, server = this.serverUrl, timeoutMS: number = 120000) {
    return this.http.post(server + url, body).pipe(timeout(timeoutMS)).toPromise();
  }

  postObservable(url: string, body: object, options: object = {}, server = this.serverUrl, timeoutMS: number = 120000): Observable<Object> {
    return this.http.post(server + url, body, options);
  }

  delete(url: string, body: object, server = this.serverUrl) {
    return this.http.delete(server + url, body).toPromise();
  }

  put(url: string, body: object, server = this.serverUrl) {
    return this.http.put(server + url, body).toPromise();
  }


}
