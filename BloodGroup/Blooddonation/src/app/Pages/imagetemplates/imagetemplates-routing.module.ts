import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ImagetemplatesPage } from './imagetemplates.page';

const routes: Routes = [
  {
    path: '',
    component: ImagetemplatesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ImagetemplatesPageRoutingModule {}
