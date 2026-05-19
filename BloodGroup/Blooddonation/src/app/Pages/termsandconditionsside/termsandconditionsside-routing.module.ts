import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TermsandconditionssidePage } from './termsandconditionsside.page';

const routes: Routes = [
  {
    path: '',
    component: TermsandconditionssidePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TermsandconditionssidePageRoutingModule {}
