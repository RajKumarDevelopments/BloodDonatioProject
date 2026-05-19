import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EligibilitycriteriaPageRoutingModule } from './eligibilitycriteria-routing.module';

import { EligibilitycriteriaPage } from './eligibilitycriteria.page';

@NgModule({
  imports: [
    CommonModule, ReactiveFormsModule,
    FormsModule,
    IonicModule,
    EligibilitycriteriaPageRoutingModule
  ],
  declarations: [EligibilitycriteriaPage]
})
export class EligibilitycriteriaPageModule {}
