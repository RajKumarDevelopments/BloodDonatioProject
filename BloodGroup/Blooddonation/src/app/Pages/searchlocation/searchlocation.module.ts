import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SearchlocationPageRoutingModule } from './searchlocation-routing.module';

import { SearchlocationPage } from './searchlocation.page';

@NgModule({
  imports: [ 
    CommonModule,
    FormsModule,
    IonicModule,
    SearchlocationPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [SearchlocationPage]
})
export class SearchlocationPageModule {}
