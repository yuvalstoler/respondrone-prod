import { TestBed } from '@angular/core/testing';

import { FRService } from './fr.service';

describe('FRService', () => {
  let service: FRService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FRService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
