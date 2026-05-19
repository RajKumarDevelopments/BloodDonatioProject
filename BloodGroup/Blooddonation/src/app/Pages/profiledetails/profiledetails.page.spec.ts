import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfiledetailsPage } from './profiledetails.page';

describe('ProfiledetailsPage', () => {
  let component: ProfiledetailsPage;
  let fixture: ComponentFixture<ProfiledetailsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfiledetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
