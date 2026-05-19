import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShareyourservicesPageRoutingModule } from './shareyourservices-routing.module';

import { ShareyourservicesPage } from './shareyourservices.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule, ReactiveFormsModule,
    IonicModule,
    ShareyourservicesPageRoutingModule
  ],
  declarations: [ShareyourservicesPage]
})
export class ShareyourservicesPageModule {}
