import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InsertQuantPageRoutingModule } from './insert-quant-routing.module';

import { InsertQuantPage } from './insert-quant.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InsertQuantPageRoutingModule
  ],
  declarations: [InsertQuantPage]
})
export class InsertQuantPageModule {}
