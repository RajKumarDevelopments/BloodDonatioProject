import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboarddetailsPage } from './dashboarddetails.page';

describe('DashboarddetailsPage', () => {
  let component: DashboarddetailsPage;
  let fixture: ComponentFixture<DashboarddetailsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboarddetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
