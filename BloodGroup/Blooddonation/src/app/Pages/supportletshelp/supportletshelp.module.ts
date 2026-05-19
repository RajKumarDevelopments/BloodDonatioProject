import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SupportletshelpPageRoutingModule } from './supportletshelp-routing.module';

import { SupportletshelpPage } from './supportletshelp.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SupportletshelpPageRoutingModule
  ],
  declarations: [SupportletshelpPage]
})
export class SupportletshelpPageModule {}
