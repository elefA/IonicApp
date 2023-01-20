import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SynchPage } from './synch.page';

const routes: Routes = [
  {
    path: '',
    component: SynchPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SynchRoutingModule {}
