import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/services/database.service';
import { GeneralService } from 'src/services/general.service';
import { SynchService } from 'src/services/synch.service';

@Component({
  selector: 'app-get-items',
  templateUrl: './synch.page.html',
})
export class SynchPage implements OnInit {
  constructor(public synchServ: SynchService, public db: DatabaseService, public general: GeneralService) {}

  ngOnInit() {}
  getItems() {
    this.synchServ.getItems().subscribe();
  }
  getZonesFromApi() {
    this.synchServ.getZones().subscribe(
      (data) => console.log(data),
      (err) => console.log(err),
      () => console.log('yay')
    );
  }

  getMomeFromApi() {
    this.synchServ.getMome().subscribe(
      (data) => console.log(data),
      (err) => console.log(err),
      () => console.log('yay')
    );
  }
}
