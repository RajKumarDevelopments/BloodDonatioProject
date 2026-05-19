import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SearchdetailsPage } from './searchdetails.page';

const routes: Routes = [
  {
    path: '',
    component: SearchdetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SearchdetailsPageRoutingModule {}
