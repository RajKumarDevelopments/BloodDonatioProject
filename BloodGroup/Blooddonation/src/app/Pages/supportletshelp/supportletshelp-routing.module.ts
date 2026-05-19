import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SupportletshelpPage } from './supportletshelp.page';

const routes: Routes = [
  {
    path: '',
    component: SupportletshelpPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SupportletshelpPageRoutingModule {}
