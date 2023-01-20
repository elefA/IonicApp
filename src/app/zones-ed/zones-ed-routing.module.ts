import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ZonesEdPage } from './zones-ed.page';

const routes: Routes = [
  {
    path: '',
    component: ZonesEdPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ZonesEdPageRoutingModule {}
