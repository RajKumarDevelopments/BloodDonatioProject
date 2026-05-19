import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FinalreviewPageRoutingModule } from './finalreview-routing.module';

import { FinalreviewPage } from './finalreview.page';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FinalreviewPageRoutingModule
    
  ],
  declarations: [FinalreviewPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class FinalreviewPageModule {}
