import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NeedbloodPage } from './needblood.page';

const routes: Routes = [
  {
    path: '',
    component: NeedbloodPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NeedbloodPageRoutingModule {}
