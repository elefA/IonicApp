import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'start-page',
    pathMatch: 'full'
  },
  {
    path: 'inv-count',
    loadChildren: () => import('./inv-count/inv-count.module').then( m => m.InvCountPageModule)
  },
  {
    path: 'start-page',
    loadChildren: () => import('./start-page/start-page.module').then( m => m.StartPagePageModule)
  },
  {
    path: 'zones-ed',
    loadChildren: () => import('./zones-ed/zones-ed.module').then( m => m.ZonesEdPageModule)
  },
  {
    path: 'inv-count01',
    loadChildren: () => import('./inv-count01/inv-count01.module').then( m => m.InvCount01PageModule)
  },
  {
    path: 'get-items',
    loadChildren: () => import('./synch/synch.module').then( m => m.SynchPageModule)
  },
  {
    path: 'insert-quant',
    loadChildren: () => import('./insert-quant/insert-quant.module').then( m => m.InsertQuantPageModule)
  },
  {
    path: 'invcount-sheets',
    loadChildren: () => import('./invcount-sheets/invcount-sheets.module').then( m => m.InvcountSheetsPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
