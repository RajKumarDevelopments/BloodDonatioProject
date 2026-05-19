import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SearchdonorsPage } from './searchdonors.page';

const routes: Routes = [
  {
    path: '',
    component: SearchdonorsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SearchdonorsPageRoutingModule {}
