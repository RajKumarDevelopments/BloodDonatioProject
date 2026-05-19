import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UsercontrolPage } from './usercontrol.page';

const routes: Routes = [
  {
    path: '',
    component: UsercontrolPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsercontrolPageRoutingModule {}
