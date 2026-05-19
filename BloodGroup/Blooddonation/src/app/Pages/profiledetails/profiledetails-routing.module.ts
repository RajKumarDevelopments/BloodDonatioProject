import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProfiledetailsPage } from './profiledetails.page';

const routes: Routes = [
  {
    path: '',
    component: ProfiledetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfiledetailsPageRoutingModule {}
