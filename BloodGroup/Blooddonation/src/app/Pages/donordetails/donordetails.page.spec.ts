import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DonordetailsPage } from './donordetails.page';

describe('DonordetailsPage', () => {
  let component: DonordetailsPage;
  let fixture: ComponentFixture<DonordetailsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DonordetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
