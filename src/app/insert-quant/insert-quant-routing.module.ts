import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InsertQuantPage } from './insert-quant.page';

const routes: Routes = [
  {
    path: '',
    component: InsertQuantPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InsertQuantPageRoutingModule {}
