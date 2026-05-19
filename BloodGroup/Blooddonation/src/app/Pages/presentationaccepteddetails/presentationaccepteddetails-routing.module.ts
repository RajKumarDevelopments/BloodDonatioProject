import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PresentationaccepteddetailsPage } from './presentationaccepteddetails.page';

const routes: Routes = [
  {
    path: '',
    component: PresentationaccepteddetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PresentationaccepteddetailsPageRoutingModule {}
