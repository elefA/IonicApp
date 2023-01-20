import { InvcountListComponent } from './../invcount-list/invcount-list.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InvCount01PageRoutingModule } from './inv-count01-routing.module';

import { InvCount01Page } from './inv-count01.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InvCount01PageRoutingModule
  ],
  exports:[],
  declarations: [InvCount01Page]
})
export class InvCount01PageModule {}
