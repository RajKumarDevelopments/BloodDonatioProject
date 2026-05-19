import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MultipledonorsPageRoutingModule } from './multipledonors-routing.module';

import { MultipledonorsPage } from './multipledonors.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MultipledonorsPageRoutingModule
  ],
  declarations: [MultipledonorsPage]
})
export class MultipledonorsPageModule {}
