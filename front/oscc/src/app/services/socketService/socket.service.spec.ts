import { TestBed } from '@angular/core/testing';

import { SocketService } from './socket.service';
import {SocketIoConfig, SocketIoModule} from 'ngx-socket-io';
import {SOCKET_CONFIG} from '../../../environments/environment';
import {HttpClientModule} from '@angular/common/http';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {ToastrModule} from 'ngx-toastr';

describe('SocketService', () => {
  const config: SocketIoConfig = SOCKET_CONFIG;

  beforeEach(() => TestBed.configureTestingModule({
    providers: [SocketService],
    imports: [
      SocketIoModule.forRoot(config),
      HttpClientModule,
      HttpClientTestingModule,
      RouterTestingModule,
      ToastrModule.forRoot()
    ]}));

  it('should be created', () => {
    const service: SocketService = TestBed.get(SocketService);
    expect(service).toBeTruthy();
  });
});
