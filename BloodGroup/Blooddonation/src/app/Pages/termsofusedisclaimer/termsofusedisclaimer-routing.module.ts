import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TermsofusedisclaimerPage } from './termsofusedisclaimer.page';

const routes: Routes = [
  {
    path: '',
    component: TermsofusedisclaimerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TermsofusedisclaimerPageRoutingModule {}
