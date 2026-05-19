import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SearchlocationPage } from './searchlocation.page';

const routes: Routes = [
  {
    path: '',
    component: SearchlocationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SearchlocationPageRoutingModule {}
