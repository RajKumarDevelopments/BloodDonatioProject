import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DonorRegistrationPage } from './donor-registration.page';

describe('DonorRegistrationPage', () => {
  let component: DonorRegistrationPage;
  let fixture: ComponentFixture<DonorRegistrationPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DonorRegistrationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
