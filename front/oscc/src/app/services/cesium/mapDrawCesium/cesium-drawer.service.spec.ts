import { TestBed } from '@angular/core/testing';

import { CesiumDrawerService } from './cesium-drawer.service';

describe('CesiumDrawerService', () => {
  let service: CesiumDrawerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CesiumDrawerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
