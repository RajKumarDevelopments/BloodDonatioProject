import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DonorguidePageRoutingModule } from './donorguide-routing.module';

import { DonorguidePage } from './donorguide.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DonorguidePageRoutingModule
  ],
  declarations: [DonorguidePage]
})
export class DonorguidePageModule {}
