import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RequsetformPageRoutingModule } from './requsetform-routing.module';

import { RequsetformPage } from './requsetform.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule, ReactiveFormsModule,
    IonicModule,
    RequsetformPageRoutingModule
  ],
  declarations: [RequsetformPage]
})
export class RequsetformPageModule {}
