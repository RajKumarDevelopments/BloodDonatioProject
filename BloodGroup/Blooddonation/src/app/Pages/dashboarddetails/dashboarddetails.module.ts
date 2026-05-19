import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DashboarddetailsPageRoutingModule } from './dashboarddetails-routing.module';

import { DashboarddetailsPage } from './dashboarddetails.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DashboarddetailsPageRoutingModule
  ],
  declarations: [DashboarddetailsPage]
})
export class DashboarddetailsPageModule {}
