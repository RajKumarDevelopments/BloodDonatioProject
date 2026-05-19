import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HospitaldetailsPage } from './hospitaldetails.page';

describe('HospitaldetailsPage', () => {
  let component: HospitaldetailsPage;
  let fixture: ComponentFixture<HospitaldetailsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(HospitaldetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
