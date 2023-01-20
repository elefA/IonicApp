import { SynchService } from './../../services/synch.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { GeneralService } from 'src/services/general.service';
import { DatabaseService } from '../../services/database.service';
import { Zone } from '../classes/zone';

@Component({
  selector: 'app-zones-ed',
  templateUrl: './zones-ed.page.html',
})
export class ZonesEdPage {
  zoneId: number;
  zoneDescr: string;
  constructor(
    public db: DatabaseService,
    public general: GeneralService,
    private alertCtrl: AlertController,
    private router: Router,
    public synchServ: SynchService
  ) {
    this.db.createDatabase();
  }

  ionViewWillEnter() {
    this.getZones();
    if (this.general.passwordGiven === 0) {
      this.presentPrompt();
    }
  }

  addZone(id: number, descr: string) {
    this.db.addZone(id, descr).then((data) => {
      this.general.msgToast(data, 1500);
      this.getZones();
      this.zoneDescr = '';
      this.zoneId = null;
    });
  }

  getZones() {
    this.db.getZones();
  }

  deleteZone(zone: Zone) {
    if (
      confirm(
        'Η διαγραφή της ζώνης θα διαγράψει και τις κινήσεις απογραφής για την ζώνη αυτή'
      )
    ) {
      this.db.deleteZone(zone.id).then((data) => {
        this.general.msgToast(data, 1500);
        this.getZones();
      });
    }
  }

  sendZone(zone: Zone) {
    this.synchServ.clicked = true;
    this.general.selectedZone = zone;
    this.db.getCount01Zone(zone.id, true).then(() => {
      if (this.db.liCount01.length > 0) {
        if (zone.id !== 666) {
          this.synchServ.postCount01();
        } else {
          this.synchServ.postCountSum();
          this.untoggle();
        }
      } else {
        this.untoggle();
        this.general.msgToast('Η ζώνη δεν έχει κινήσεις.', 1500);
      }
    });
  }
  untoggle() {
    this.synchServ.clicked = false;
  }

  lock(zone: Zone) {
    this.db.lockZone(zone);
  }

  unlock(zone: Zone) {
    if (zone.id!==666 &&
      !confirm(
        'Για να ξεκλειδώσετε μία ζώνη θα πρέπει να διαγράψετε όλες τις κινήσεις της στην βάση πρώτα.' +
          'Και να βεβαιωθείτε ότι το σύνολο των εγγραφών που αφορούν τη συγκεκριμένη ζώνη ' +
          'βρίσκονται στο παρόν κινητό καταγραφικό'
      )
    ) {
      return;
    }
    this.db.unlockZone(zone);
  }
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

  presentPrompt() {
    const alert = this.alertCtrl
      .create({
        header: 'Log in',
        backdropDismiss: false,
        inputs: [
          {
            name: 'password',
            placeholder: 'Password',
            type: 'number',
          },
        ],
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: (data) => {
              this.router.navigate(['start-page']);
            },
          },
          {
            text: 'Login',
            handler: (data) => {
              if (data.password === '9321') {
                console.log('logged in');
              } else {
                return false;
              }
            },
          },
        ],
      })
      .then((alert1) => {
        alert1.present();
      });
  }
}
