import { Component } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'Αρχική', url: '/start-page', icon: 'home' },
    { title: 'Απογραφή', url: '/inv-count', icon: 'reader-outline' },
    { title: 'Διαχείριση', url: '/zones-ed', icon: 'map-outline' },
    { title: 'Φύλλα Απογραφής', url: '/invcount-sheets', icon: 'map-outline' }
  ];

  constructor() {}
}
