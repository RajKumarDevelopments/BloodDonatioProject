import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HospitallistPageRoutingModule } from './hospitallist-routing.module';

import { HospitallistPage } from './hospitallist.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HospitallistPageRoutingModule
  ],
  declarations: [HospitallistPage]
})
export class HospitallistPageModule {}
