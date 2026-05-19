import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LearnaboutbloodPageRoutingModule } from './learnaboutblood-routing.module';

import { LearnaboutbloodPage } from './learnaboutblood.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LearnaboutbloodPageRoutingModule
  ],
  declarations: [LearnaboutbloodPage]
})
export class LearnaboutbloodPageModule {}
