import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TermsandconditionssidePageRoutingModule } from './termsandconditionsside-routing.module';

import { TermsandconditionssidePage } from './termsandconditionsside.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TermsandconditionssidePageRoutingModule
  ],
  declarations: [TermsandconditionssidePage]
})
export class TermsandconditionssidePageModule {}
