import { TestBed } from '@angular/core/testing';

import { NFZService } from './nfz.service';

describe('NFZService', () => {
  let service: NFZService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NFZService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
