import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RequsetformPage } from './requsetform.page';

const routes: Routes = [
  {
    path: '',
    component: RequsetformPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RequsetformPageRoutingModule {}
