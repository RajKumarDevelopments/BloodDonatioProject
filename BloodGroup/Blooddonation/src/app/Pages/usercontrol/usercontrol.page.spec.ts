import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UsercontrolPage } from './usercontrol.page';

describe('UsercontrolPage', () => {
  let component: UsercontrolPage;
  let fixture: ComponentFixture<UsercontrolPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(UsercontrolPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
