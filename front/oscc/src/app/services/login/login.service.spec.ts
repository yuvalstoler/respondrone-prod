import { TestBed } from '@angular/core/testing';

import { LoginService } from './login.service';
import {SocketIoConfig, SocketIoModule} from 'ngx-socket-io';
import {SOCKET_CONFIG} from '../../../environments/environment';
import {HttpClientModule} from '@angular/common/http';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {ToastrModule} from 'ngx-toastr';
import {RouterTestingModule} from '@angular/router/testing';

describe('LoginService', () => {
  const config: SocketIoConfig = SOCKET_CONFIG;

  beforeEach(() => TestBed.configureTestingModule({
    providers: [LoginService],
    imports: [
      SocketIoModule.forRoot(config),
      HttpClientModule,
      HttpClientTestingModule,
      RouterTestingModule,
      ToastrModule.forRoot()
    ]}));

  it('should be created', () => {
    const service: LoginService = TestBed.get(LoginService);
    expect(service).toBeTruthy();
  });
});
