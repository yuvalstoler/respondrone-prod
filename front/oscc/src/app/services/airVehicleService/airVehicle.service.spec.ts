import { TestBed } from '@angular/core/testing';

import { AirVehicleService } from './airVehicle.service';

describe('AirVehicleService', () => {
  let service: AirVehicleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AirVehicleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
