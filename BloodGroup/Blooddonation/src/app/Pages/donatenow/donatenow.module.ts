import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DonatenowPageRoutingModule } from './donatenow-routing.module';

import { DonatenowPage } from './donatenow.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DonatenowPageRoutingModule
  ],
  declarations: [DonatenowPage]
})
export class DonatenowPageModule {}
