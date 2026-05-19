import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PostabloodrequestPageRoutingModule } from './postabloodrequest-routing.module';

import { PostabloodrequestPage } from './postabloodrequest.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PostabloodrequestPageRoutingModule
  ],
  declarations: [PostabloodrequestPage]
})
export class PostabloodrequestPageModule {}
