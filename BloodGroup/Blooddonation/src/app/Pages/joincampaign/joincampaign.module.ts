import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { JoincampaignPageRoutingModule } from './joincampaign-routing.module';

import { JoincampaignPage } from './joincampaign.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    JoincampaignPageRoutingModule
  ],
  declarations: [JoincampaignPage]
})
export class JoincampaignPageModule {}
