import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NeedbloodPageRoutingModule } from './needblood-routing.module';

import { NeedbloodPage } from './needblood.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NeedbloodPageRoutingModule
  ],
  declarations: [NeedbloodPage]
})
export class NeedbloodPageModule {}
