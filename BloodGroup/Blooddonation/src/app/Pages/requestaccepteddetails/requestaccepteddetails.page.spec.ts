import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RequestaccepteddetailsPage } from './requestaccepteddetails.page';

describe('RequestaccepteddetailsPage', () => {
  let component: RequestaccepteddetailsPage;
  let fixture: ComponentFixture<RequestaccepteddetailsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestaccepteddetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
