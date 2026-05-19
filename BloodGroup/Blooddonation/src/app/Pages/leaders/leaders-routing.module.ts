import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LeadersPage } from './leaders.page';

const routes: Routes = [
  {
    path: '',
    component: LeadersPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LeadersPageRoutingModule {}
