import { TestBed } from '@angular/core/testing';

import { BearerService } from './bearer.service';

describe('BearerService', () => {
  let service: BearerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BearerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
