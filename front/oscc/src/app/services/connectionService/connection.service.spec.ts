import { TestBed } from '@angular/core/testing';

import { ConnectionService } from './connection.service';
import { HttpClientModule } from '@angular/common/http';
import {SocketIoConfig, SocketIoModule} from 'ngx-socket-io';
import {SOCKET_CONFIG} from '../../../environments/environment';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('ConnectionService', () => {
  const config: SocketIoConfig = SOCKET_CONFIG;

  beforeEach(() => TestBed.configureTestingModule({
    providers: [ConnectionService],
    imports: [
      SocketIoModule.forRoot(config),
      HttpClientModule,
      HttpClientTestingModule,
    ]}));

  it('should be created', () => {
    const service: ConnectionService = TestBed.get(ConnectionService);
    expect(service).toBeTruthy();
  });
});
