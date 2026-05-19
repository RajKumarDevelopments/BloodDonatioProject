import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DonorssearchPage } from './donorssearch.page';

const routes: Routes = [
  {
    path: '',
    component: DonorssearchPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DonorssearchPageRoutingModule {}
