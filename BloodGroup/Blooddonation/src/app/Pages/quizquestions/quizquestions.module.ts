import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { QuizquestionsPageRoutingModule } from './quizquestions-routing.module';

import { QuizquestionsPage } from './quizquestions.page';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule, ReactiveFormsModule,
    QuizquestionsPageRoutingModule
  ],
  declarations: [QuizquestionsPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class QuizquestionsPageModule {}
