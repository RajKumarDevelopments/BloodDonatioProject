import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HospitallistPage } from './hospitallist.page';

const routes: Routes = [
  {
    path: '',
    component: HospitallistPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HospitallistPageRoutingModule {}
