import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InvcountSheetsPageRoutingModule } from './invcount-sheets-routing.module';

import { InvcountSheetsPage } from './invcount-sheets.page';
import { InvcountListComponent } from '../invcount-list/invcount-list.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InvcountSheetsPageRoutingModule
  ],
  exports:[InvcountListComponent],
  declarations: [InvcountSheetsPage,InvcountListComponent]
})
export class InvcountSheetsPageModule {}
