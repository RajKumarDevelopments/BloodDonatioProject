import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UsercontrolPageRoutingModule } from './usercontrol-routing.module';

import { UsercontrolPage } from './usercontrol.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UsercontrolPageRoutingModule,
  ],
  declarations: [UsercontrolPage]
})
export class UsercontrolPageModule {}
