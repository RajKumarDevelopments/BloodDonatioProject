import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RequestaccepteddetailsPageRoutingModule } from './requestaccepteddetails-routing.module';

import { RequestaccepteddetailsPage } from './requestaccepteddetails.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RequestaccepteddetailsPageRoutingModule
  ],
  declarations: [RequestaccepteddetailsPage]
})
export class RequestaccepteddetailsPageModule {}
