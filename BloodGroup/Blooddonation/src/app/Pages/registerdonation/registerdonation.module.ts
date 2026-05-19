import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegisterdonationPageRoutingModule } from './registerdonation-routing.module';

import { RegisterdonationPage } from './registerdonation.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegisterdonationPageRoutingModule
  ],
  declarations: [RegisterdonationPage]
})
export class RegisterdonationPageModule {}
