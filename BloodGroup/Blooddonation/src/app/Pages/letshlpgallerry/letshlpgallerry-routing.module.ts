import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LetshlpgallerryPage } from './letshlpgallerry.page';

const routes: Routes = [
  {
    path: '',
    component: LetshlpgallerryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LetshlpgallerryPageRoutingModule {}
