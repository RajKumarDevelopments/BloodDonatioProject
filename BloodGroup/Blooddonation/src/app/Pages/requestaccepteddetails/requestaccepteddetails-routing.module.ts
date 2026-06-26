import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RequestaccepteddetailsPage } from './requestaccepteddetails.page';

const routes: Routes = [
  {
    path: '',
    component: RequestaccepteddetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RequestaccepteddetailsPageRoutingModule {}
