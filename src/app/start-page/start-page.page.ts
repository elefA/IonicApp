/* eslint-disable prefer-const */
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { MenuController, ToastController } from '@ionic/angular';
import { GeneralService } from 'src/services/general.service';
import { DatabaseService } from '../../services/database.service';
import { Item } from '../classes/item';
import { Zone } from '../classes/zone';

@Component({
  selector: 'app-start-page',
  templateUrl: './start-page.page.html',
  styleUrls: ['./start-page.page.scss'],
})
export class StartPagePage implements OnInit {
  users = ['Στέλιος', 'Βαγγέλης', 'Νίκος', 'Γιάννος', 'Δημήτρης'];

  constructor(
    private menuCtrl: MenuController,
    public general: GeneralService,
    private toastController: ToastController,
    private db: DatabaseService
  ) {
    this.menuCtrl.swipeGesture(false);
  }

  ngOnInit() {
    this.menuCtrl.open().then(() => {
      this.general.isSelected = true;
      this.db.createDatabase().then(() => {
        this.db.getZones();
        this.db.getMome();
        this.db.addZone(666, 'Ξεχασμένα');
      });
      this.menuCtrl.open();
    });
  }

  selectUser() {
    if (this.general.selectedUser) {
      this.general.isSelected = true;
      this.db.createDatabase().then(() => {
        this.db.getZones();
        this.db.getMome();
        this.db.addZone(666, 'Ξεχασμένα');
      });
      this.menuCtrl.open();
    } else {
      this.general.msgToast('Παρακαλώ επιλέξτε χειριστή.', 2000);
    }
  }
}
