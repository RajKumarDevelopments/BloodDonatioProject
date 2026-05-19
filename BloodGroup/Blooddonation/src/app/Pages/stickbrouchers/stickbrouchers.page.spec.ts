import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StickbrouchersPage } from './stickbrouchers.page';

describe('StickbrouchersPage', () => {
  let component: StickbrouchersPage;
  let fixture: ComponentFixture<StickbrouchersPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(StickbrouchersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
