import { TestBed } from '@angular/core/testing';

import { StatusIndicatorService } from './status-indicator.service';

describe('StatusIndicatorService', () => {
  let service: StatusIndicatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StatusIndicatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
