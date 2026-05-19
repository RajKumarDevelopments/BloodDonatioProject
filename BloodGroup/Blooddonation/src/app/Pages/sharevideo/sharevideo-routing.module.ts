import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SharevideoPage } from './sharevideo.page';

const routes: Routes = [
  {
    path: '',
    component: SharevideoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SharevideoPageRoutingModule {}
