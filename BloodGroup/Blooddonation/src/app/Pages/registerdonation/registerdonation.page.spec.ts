import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterdonationPage } from './registerdonation.page';

describe('RegisterdonationPage', () => {
  let component: RegisterdonationPage;
  let fixture: ComponentFixture<RegisterdonationPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterdonationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
