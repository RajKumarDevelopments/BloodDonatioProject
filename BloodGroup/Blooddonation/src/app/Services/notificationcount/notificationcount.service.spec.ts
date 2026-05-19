import { TestBed } from '@angular/core/testing';

import { NotificationcountService } from './notificationcount.service';

describe('NotificationcountService', () => {
  let service: NotificationcountService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificationcountService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
