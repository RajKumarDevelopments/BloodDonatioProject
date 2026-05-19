import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { PresentationaccepteddetailsPageRoutingModule } from './presentationaccepteddetails-routing.module';
import { PresentationaccepteddetailsPage } from './presentationaccepteddetails.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    PresentationaccepteddetailsPageRoutingModule
  ],
  declarations: [PresentationaccepteddetailsPage]
})
export class PresentationaccepteddetailsPageModule {}
