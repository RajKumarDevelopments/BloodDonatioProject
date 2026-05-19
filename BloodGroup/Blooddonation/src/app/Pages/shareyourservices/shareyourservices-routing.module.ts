import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShareyourservicesPage } from './shareyourservices.page';

const routes: Routes = [
  {
    path: '',
    component: ShareyourservicesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShareyourservicesPageRoutingModule {}
