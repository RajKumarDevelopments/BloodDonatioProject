import { TestBed } from '@angular/core/testing';

import { GeolocationserviceService } from './geolocationservice.service';

describe('GeolocationserviceService', () => {
  let service: GeolocationserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GeolocationserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
