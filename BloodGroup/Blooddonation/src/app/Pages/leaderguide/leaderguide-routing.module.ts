import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LeaderguidePage } from './leaderguide.page';

const routes: Routes = [
  {
    path: '',
    component: LeaderguidePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LeaderguidePageRoutingModule {}
