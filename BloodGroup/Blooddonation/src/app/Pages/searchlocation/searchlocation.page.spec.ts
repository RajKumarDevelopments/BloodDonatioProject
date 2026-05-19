import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchlocationPage } from './searchlocation.page';

describe('SearchlocationPage', () => {
  let component: SearchlocationPage;
  let fixture: ComponentFixture<SearchlocationPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchlocationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
