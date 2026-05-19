import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MultipledonorsPage } from './multipledonors.page';

const routes: Routes = [
  {
    path: '',
    component: MultipledonorsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MultipledonorsPageRoutingModule {}
