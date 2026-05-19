import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StickbrouchersPageRoutingModule } from './stickbrouchers-routing.module';

import { StickbrouchersPage } from './stickbrouchers.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StickbrouchersPageRoutingModule
  ],
  declarations: [StickbrouchersPage]
})
export class StickbrouchersPageModule {}
