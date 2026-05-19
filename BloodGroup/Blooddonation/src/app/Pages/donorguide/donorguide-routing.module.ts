import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DonorguidePage } from './donorguide.page';

const routes: Routes = [
  {
    path: '',
    component: DonorguidePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DonorguidePageRoutingModule {}
