import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StickbrouchersPage } from './stickbrouchers.page';

const routes: Routes = [
  {
    path: '',
    component: StickbrouchersPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StickbrouchersPageRoutingModule {}
