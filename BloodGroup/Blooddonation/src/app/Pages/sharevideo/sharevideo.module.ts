import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SharevideoPageRoutingModule } from './sharevideo-routing.module';

import { SharevideoPage } from './sharevideo.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharevideoPageRoutingModule
  ],
  declarations: [SharevideoPage]
})
export class SharevideoPageModule {}
