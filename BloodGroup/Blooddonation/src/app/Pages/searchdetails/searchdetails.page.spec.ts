import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchdetailsPage } from './searchdetails.page';

describe('SearchdetailsPage', () => {
  let component: SearchdetailsPage;
  let fixture: ComponentFixture<SearchdetailsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchdetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
