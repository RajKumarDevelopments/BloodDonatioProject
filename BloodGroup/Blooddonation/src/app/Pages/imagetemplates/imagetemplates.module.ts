import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ImagetemplatesPageRoutingModule } from './imagetemplates-routing.module';

import { ImagetemplatesPage } from './imagetemplates.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ImagetemplatesPageRoutingModule
  ],
  declarations: [ImagetemplatesPage]
})
export class ImagetemplatesPageModule {}
