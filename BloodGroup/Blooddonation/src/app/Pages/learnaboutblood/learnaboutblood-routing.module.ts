import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LearnaboutbloodPage } from './learnaboutblood.page';

const routes: Routes = [
  {
    path: '',
    component: LearnaboutbloodPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LearnaboutbloodPageRoutingModule {}
