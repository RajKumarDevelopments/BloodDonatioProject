import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PostabloodrequestPage } from './postabloodrequest.page';

const routes: Routes = [
  {
    path: '',
    component: PostabloodrequestPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PostabloodrequestPageRoutingModule {}
