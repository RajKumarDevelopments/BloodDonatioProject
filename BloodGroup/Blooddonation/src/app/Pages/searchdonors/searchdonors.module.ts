import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SearchdonorsPageRoutingModule } from './searchdonors-routing.module';

import { SearchdonorsPage } from './searchdonors.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SearchdonorsPageRoutingModule
  ],
  declarations: [SearchdonorsPage]
})
export class SearchdonorsPageModule {}
