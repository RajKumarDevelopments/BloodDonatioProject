import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DownloadbrochersPage } from './downloadbrochers.page';

const routes: Routes = [
  {
    path: '',
    component: DownloadbrochersPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DownloadbrochersPageRoutingModule {}
