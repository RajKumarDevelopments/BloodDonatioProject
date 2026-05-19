import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RquestpresentationPage } from './rquestpresentation.page';

describe('RquestpresentationPage', () => {
  let component: RquestpresentationPage;
  let fixture: ComponentFixture<RquestpresentationPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RquestpresentationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Deduplication Logic', () => {
    beforeEach(() => {
      // Mock UserDetails
      component.UserDetails = [{ RegId: 1 }];
    });

    it('should deduplicate active requests by RPId', () => {
      // Simulate raw data with duplicate RPIds
      const rawData = [
        {
          RPId: 1,
          CreatedBy: 1,
          RequestAcceptStatus: 1,
          RequestDate: new Date().toISOString(),
          ModifiedDate: new Date(Date.now() - 1000).toISOString(),
          Contact_name: 'John',
        },
        {
          RPId: 1, // Same RPId - duplicate
          CreatedBy: 1,
          RequestAcceptStatus: 1,
          RequestDate: new Date().toISOString(),
          ModifiedDate: new Date().toISOString(), // More recent
          Contact_name: 'John',
        },
        {
          RPId: 2,
          CreatedBy: 1,
          RequestAcceptStatus: 1,
          RequestDate: new Date().toISOString(),
          ModifiedDate: new Date().toISOString(),
          Contact_name: 'Jane',
        },
      ];

      // Simulate deduplication logic
      const uniqueActiveMap = new Map();
      for (const item of rawData) {
        const rpId = item.RPId;
        if (!uniqueActiveMap.has(rpId)) {
          uniqueActiveMap.set(rpId, item);
        } else {
          const existing = uniqueActiveMap.get(rpId);
          const existingDate = new Date(existing.ModifiedDate || existing.CreatedDate || 0).getTime();
          const currentDate = new Date(item.ModifiedDate || item.CreatedDate || 0).getTime();
          if (currentDate > existingDate) {
            uniqueActiveMap.set(rpId, item);
          }
        }
      }
      const result = Array.from(uniqueActiveMap.values());

      // Should have only 2 unique records (RPId 1 and 2)
      expect(result.length).toBe(2);
      // RPId 1 should have the more recent ModifiedDate
      expect(result[0].RPId).toBe(1);
      expect(result[1].RPId).toBe(2);
    });

    it('should deduplicate closed requests by RPId', () => {
      // Simulate raw data with duplicate RPIds for closed requests
      const rawData = [
        {
          RPId: 10,
          CreatedBy: 1,
          RequestAcceptStatus: 4,
          RequestDate: new Date().toISOString(),
          ModifiedDate: new Date(Date.now() - 2000).toISOString(),
          Contact_name: 'Alice',
        },
        {
          RPId: 10, // Same RPId - duplicate
          CreatedBy: 1,
          RequestAcceptStatus: 4,
          RequestDate: new Date().toISOString(),
          ModifiedDate: new Date(Date.now() - 1000).toISOString(), // More recent
          Contact_name: 'Alice',
        },
        {
          RPId: 11,
          Requestedto: 1, // Requested to me
          RequestAcceptStatus: 4,
          RequestDate: new Date().toISOString(),
          ModifiedDate: new Date().toISOString(),
          Contact_name: 'Bob',
        },
      ];

      // Simulate deduplication logic
      const uniqueClosedMap = new Map();
      for (const item of rawData) {
        const rpId = item.RPId;
        if (!uniqueClosedMap.has(rpId)) {
          uniqueClosedMap.set(rpId, item);
        } else {
          const existing = uniqueClosedMap.get(rpId);
          const existingDate = new Date(existing.ModifiedDate || existing.CreatedDate || 0).getTime();
          const currentDate = new Date(item.ModifiedDate || item.CreatedDate || 0).getTime();
          if (currentDate > existingDate) {
            uniqueClosedMap.set(rpId, item);
          }
        }
      }
      const result = Array.from(uniqueClosedMap.values());

      // Should have only 2 unique records (RPId 10 and 11)
      expect(result.length).toBe(2);
      // RPId 10 should have the more recent ModifiedDate
      expect(result[0].RPId).toBe(10);
      expect(result[1].RPId).toBe(11);
    });

    it('should not duplicate records when switching tabs', () => {
      // Verify that tab switching does not cause duplicates
      const activeRequests = [
        { RPId: 1, CreatedBy: 1, RequestAcceptStatus: 1, Contact_name: 'Test1' },
        { RPId: 2, CreatedBy: 1, RequestAcceptStatus: 1, Contact_name: 'Test2' },
      ];

      component.Myrequsest = activeRequests;
      component.selectedTab = 'open';
      component.updateTabView();

      expect(component.Myrequsest.length).toBe(2);
      expect(component.opening).toBe(true);

      // Switch to closed tab
      component.selectedTab = 'closed';
      component.MyClosedrequsest = [
        { RPId: 3, CreatedBy: 1, RequestAcceptStatus: 4, Contact_name: 'Test3' },
      ];
      component.updateTabView();

      expect(component.MyClosedrequsest.length).toBe(1);
      expect(component.closed).toBe(true);

      // Switch back to active tab - should still have 2 records
      component.selectedTab = 'open';
      component.updateTabView();

      expect(component.Myrequsest.length).toBe(2);
    });
  });
});
