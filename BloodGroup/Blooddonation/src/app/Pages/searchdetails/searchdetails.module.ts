import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SearchdetailsPageRoutingModule } from './searchdetails-routing.module';

import { SearchdetailsPage } from './searchdetails.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SearchdetailsPageRoutingModule
  ],
  declarations: [SearchdetailsPage]
})
export class SearchdetailsPageModule {}
