import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InvCountPage } from './inv-count.page';

const routes: Routes = [
  {
    path: '',
    component: InvCountPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InvCountPageRoutingModule {}
