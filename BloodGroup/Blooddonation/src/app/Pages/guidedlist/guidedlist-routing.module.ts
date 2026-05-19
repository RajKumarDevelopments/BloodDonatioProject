import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GuidedlistPage } from './guidedlist.page';

const routes: Routes = [
  {
    path: '',
    component: GuidedlistPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GuidedlistPageRoutingModule {}
