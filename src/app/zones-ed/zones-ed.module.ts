import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ZonesEdPageRoutingModule } from './zones-ed-routing.module';

import { ZonesEdPage } from './zones-ed.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ZonesEdPageRoutingModule
  ],
  declarations: [ZonesEdPage]
})
export class ZonesEdPageModule {}
