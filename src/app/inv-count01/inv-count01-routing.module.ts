import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InvCount01Page } from './inv-count01.page';

const routes: Routes = [
  {
    path: '',
    component: InvCount01Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InvCount01PageRoutingModule {}
