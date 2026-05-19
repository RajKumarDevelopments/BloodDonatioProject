import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RquestpresentationPage } from './rquestpresentation.page';

const routes: Routes = [
  {
    path: '',
    component: RquestpresentationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RquestpresentationPageRoutingModule { }
