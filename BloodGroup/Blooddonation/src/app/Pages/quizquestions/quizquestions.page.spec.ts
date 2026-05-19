import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QuizquestionsPage } from './quizquestions.page';

describe('QuizquestionsPage', () => {
  let component: QuizquestionsPage;
  let fixture: ComponentFixture<QuizquestionsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(QuizquestionsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
