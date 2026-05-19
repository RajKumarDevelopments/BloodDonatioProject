import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EligibilitycriteriaPage } from './eligibilitycriteria.page';

const routes: Routes = [
  {
    path: '',
    component: EligibilitycriteriaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EligibilitycriteriaPageRoutingModule {}
