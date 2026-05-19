import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PrivacypolicysidePageRoutingModule } from './privacypolicyside-routing.module';

import { PrivacypolicysidePage } from './privacypolicyside.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PrivacypolicysidePageRoutingModule
  ],
  declarations: [PrivacypolicysidePage]
})
export class PrivacypolicysidePageModule {}
