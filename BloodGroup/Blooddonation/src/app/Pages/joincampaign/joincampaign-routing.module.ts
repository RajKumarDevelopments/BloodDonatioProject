import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { JoincampaignPage } from './joincampaign.page';

const routes: Routes = [
  {
    path: '',
    component: JoincampaignPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JoincampaignPageRoutingModule {}
