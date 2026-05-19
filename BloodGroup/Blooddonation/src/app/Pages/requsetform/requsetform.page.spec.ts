import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RequsetformPage } from './requsetform.page';

describe('RequsetformPage', () => {
  let component: RequsetformPage;
  let fixture: ComponentFixture<RequsetformPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RequsetformPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
