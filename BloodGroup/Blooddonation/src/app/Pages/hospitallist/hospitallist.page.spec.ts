import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HospitallistPage } from './hospitallist.page';

describe('HospitallistPage', () => {
  let component: HospitallistPage;
  let fixture: ComponentFixture<HospitallistPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(HospitallistPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
