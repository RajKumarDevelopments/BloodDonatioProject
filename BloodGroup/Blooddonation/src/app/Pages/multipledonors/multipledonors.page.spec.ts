import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MultipledonorsPage } from './multipledonors.page';

describe('MultipledonorsPage', () => {
  let component: MultipledonorsPage;
  let fixture: ComponentFixture<MultipledonorsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MultipledonorsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
