import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyrequestPage } from './myrequest.page';

describe('MyrequestPage', () => {
  let component: MyrequestPage;
  let fixture: ComponentFixture<MyrequestPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MyrequestPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
