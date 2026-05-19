import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RquestpresentationPageRoutingModule } from './rquestpresentation-routing.module';

import { RquestpresentationPage } from './rquestpresentation.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RquestpresentationPageRoutingModule
  ],
  declarations: [RquestpresentationPage]
})
export class RquestpresentationPageModule {}
