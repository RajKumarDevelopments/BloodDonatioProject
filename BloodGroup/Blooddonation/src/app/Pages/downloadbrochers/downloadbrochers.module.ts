import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DownloadbrochersPageRoutingModule } from './downloadbrochers-routing.module';

import { DownloadbrochersPage } from './downloadbrochers.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    DownloadbrochersPageRoutingModule
  ],
  declarations: [DownloadbrochersPage]
})
export class DownloadbrochersPageModule {}
