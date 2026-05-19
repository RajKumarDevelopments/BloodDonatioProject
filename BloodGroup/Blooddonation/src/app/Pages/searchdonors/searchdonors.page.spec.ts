import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchdonorsPage } from './searchdonors.page';

describe('SearchdonorsPage', () => {
  let component: SearchdonorsPage;
  let fixture: ComponentFixture<SearchdonorsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchdonorsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
