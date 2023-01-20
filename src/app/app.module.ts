import { InvCount01PageModule } from './inv-count01/inv-count01.module';
import { InvcountListComponent } from './invcount-list/invcount-list.component';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { SQLite } from '@ionic-native/sqlite/ngx';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule,HttpClientModule,InvCount01PageModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
  SQLite,Keyboard],
  bootstrap: [AppComponent],
})
export class AppModule {}
