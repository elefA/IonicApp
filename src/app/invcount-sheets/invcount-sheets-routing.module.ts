import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InvcountSheetsPage } from './invcount-sheets.page';

const routes: Routes = [
  {
    path: '',
    component: InvcountSheetsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InvcountSheetsPageRoutingModule {}
