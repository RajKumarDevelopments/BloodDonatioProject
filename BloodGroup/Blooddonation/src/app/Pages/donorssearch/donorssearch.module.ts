import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DonorssearchPageRoutingModule } from './donorssearch-routing.module';

import { DonorssearchPage } from './donorssearch.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,

    DonorssearchPageRoutingModule
  ],
  declarations: [DonorssearchPage]
})
export class DonorssearchPageModule {}
