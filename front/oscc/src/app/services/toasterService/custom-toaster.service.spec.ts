import { TestBed } from '@angular/core/testing';

import { CustomToasterService } from './custom-toaster.service';
import {SocketIoConfig, SocketIoModule} from 'ngx-socket-io';
import {SOCKET_CONFIG} from '../../../environments/environment';
import {HttpClientModule} from '@angular/common/http';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {ToastrModule} from 'ngx-toastr';

describe('CustomToasterService', () => {
  const config: SocketIoConfig = SOCKET_CONFIG;

  beforeEach(() => TestBed.configureTestingModule({
    providers: [CustomToasterService],
    imports: [
      SocketIoModule.forRoot(config),
      HttpClientModule,
      HttpClientTestingModule,
      RouterTestingModule,
      ToastrModule.forRoot()
    ]}));

  it('should be created', () => {
    const service: CustomToasterService = TestBed.get(CustomToasterService);
    expect(service).toBeTruthy();
  });
});
