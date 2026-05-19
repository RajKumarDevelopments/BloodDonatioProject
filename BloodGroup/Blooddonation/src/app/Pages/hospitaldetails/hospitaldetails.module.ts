import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HospitaldetailsPageRoutingModule } from './hospitaldetails-routing.module';

import { HospitaldetailsPage } from './hospitaldetails.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    HospitaldetailsPageRoutingModule
  ],
  declarations: [HospitaldetailsPage]
})
export class HospitaldetailsPageModule {}
