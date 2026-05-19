import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LetshlpgallerryPageRoutingModule } from './letshlpgallerry-routing.module';

import { LetshlpgallerryPage } from './letshlpgallerry.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LetshlpgallerryPageRoutingModule
  ],
  declarations: [LetshlpgallerryPage]
})
export class LetshlpgallerryPageModule {}
