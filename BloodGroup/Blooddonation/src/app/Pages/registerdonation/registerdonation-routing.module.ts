import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegisterdonationPage } from './registerdonation.page';

const routes: Routes = [
  {
    path: '',
    component: RegisterdonationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegisterdonationPageRoutingModule {}
