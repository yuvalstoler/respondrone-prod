import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
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

  post(url: string, body: object, server = this.serverUrl) {
    // const options = {headers: new Headers()};
    // options.headers.append('x-access-token', localStorage.getItem('respondroneToken') || '');
    const options = {headers: {'x-access-token': localStorage.getItem('respondroneToken') || ''}};
    return this.http.post(server + url, body, options).toPromise();
  }

  postObservable(url: string, body: object, options: any = {}, server = this.serverUrl): Observable<Object> {
    // options.headers = options.headers || new HttpHeaders();
    // options.headers.append('x-access-token', localStorage.getItem('respondroneToken') || '');
    return this.http.post(server + url, body, options);
  }

  delete(url: string, body: object, server = this.serverUrl) {
    return this.http.delete(server + url, body).toPromise();
  }

  put(url: string, body: object, server = this.serverUrl) {
    return this.http.put(server + url, body).toPromise();
  }

  getJson(url: string): any {
    return this.http.get(url).toPromise();
  }

}
