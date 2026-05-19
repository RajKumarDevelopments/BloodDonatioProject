import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LeadersPageRoutingModule } from './leaders-routing.module';

import { LeadersPage } from './leaders.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LeadersPageRoutingModule
  ],
  declarations: [LeadersPage]
})
export class LeadersPageModule {}
