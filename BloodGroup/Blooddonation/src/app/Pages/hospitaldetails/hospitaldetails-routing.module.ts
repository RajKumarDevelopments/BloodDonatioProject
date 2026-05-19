import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HospitaldetailsPage } from './hospitaldetails.page';

const routes: Routes = [
  {
    path: '',
    component: HospitaldetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HospitaldetailsPageRoutingModule {}
