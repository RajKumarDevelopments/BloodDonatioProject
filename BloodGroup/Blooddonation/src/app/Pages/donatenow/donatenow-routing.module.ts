import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DonatenowPage } from './donatenow.page';

const routes: Routes = [
  {
    path: '',
    component: DonatenowPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DonatenowPageRoutingModule {}
