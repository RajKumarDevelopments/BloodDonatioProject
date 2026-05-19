import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FinalreviewPage } from './finalreview.page';

const routes: Routes = [
  {
    path: '',
    component: FinalreviewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FinalreviewPageRoutingModule {}
