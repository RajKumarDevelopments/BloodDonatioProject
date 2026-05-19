import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GuidedlistPageRoutingModule } from './guidedlist-routing.module';

import { GuidedlistPage } from './guidedlist.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GuidedlistPageRoutingModule
  ],
  declarations: [GuidedlistPage]
})
export class GuidedlistPageModule {}
