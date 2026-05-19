import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PrivacypolicysidePage } from './privacypolicyside.page';

const routes: Routes = [
  {
    path: '',
    component: PrivacypolicysidePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PrivacypolicysidePageRoutingModule {}
