import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LeaderguidePageRoutingModule } from './leaderguide-routing.module';

import { LeaderguidePage } from './leaderguide.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LeaderguidePageRoutingModule
  ],
  declarations: [LeaderguidePage]
})
export class LeaderguidePageModule {}
