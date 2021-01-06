import { TestBed, async, inject } from '@angular/core/testing';

import { AuthGuard } from './auth.guard';
import {HttpClientModule} from '@angular/common/http';
import {RouterTestingModule} from '@angular/router/testing';
import {SocketIoConfig, SocketIoModule} from 'ngx-socket-io';
import {SOCKET_CONFIG} from '../../environments/environment';
import {ToastrModule} from 'ngx-toastr';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {LoginService} from '../services/login/login.service';

describe('AuthGuard', () => {

  const config: SocketIoConfig = SOCKET_CONFIG;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthGuard, LoginService],
      declarations: [],
      imports: [HttpClientModule,
        HttpClientTestingModule,
        RouterTestingModule,
        SocketIoModule.forRoot(config),
        ToastrModule.forRoot()]
    });
  });

  it('should ...', inject([AuthGuard], (guard: AuthGuard) => {
    expect(guard).toBeTruthy();
  }));
});
