import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InvCountPageRoutingModule } from './inv-count-routing.module';

import { InvCountPage } from './inv-count.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InvCountPageRoutingModule
  ],
  declarations: [InvCountPage]
})
export class InvCountPageModule {}
