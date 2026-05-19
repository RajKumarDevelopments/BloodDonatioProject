import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DonordetailsPageRoutingModule } from './donordetails-routing.module';

import { DonordetailsPage } from './donordetails.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DonordetailsPageRoutingModule
  ],
  declarations: [DonordetailsPage]
})
export class DonordetailsPageModule {}
