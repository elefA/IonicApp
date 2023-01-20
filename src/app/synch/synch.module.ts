import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SynchRoutingModule } from './synch-routing.module';

import { SynchPage } from './synch.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SynchRoutingModule
  ],
  declarations: [SynchPage]
})
export class SynchPageModule {}
