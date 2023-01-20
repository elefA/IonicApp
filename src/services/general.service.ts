import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Item } from 'src/app/classes/item';
import { Mome } from 'src/app/classes/Mome';
import { Zone } from 'src/app/classes/zone';

@Injectable({
  providedIn: 'root',
})
export class GeneralService {
  dbCreate=false;
  isSelected = false;
  selectedUser = '';
  selectedZone: Zone;
  passwordGiven = 0;
  fromForm = '';
  zones: Zone[] = new Array<Zone>();
  lockedZones: Zone[] = new Array<Zone>();
  momes: Mome[] = new Array<Mome>();
  ipaddress: string;


  constructor(public toastController: ToastController) {}

  async msgToast(msg: string, dur: number) {
    const toast = await this.toastController.create({
      message: msg,
      duration: dur,
    });
    toast.present();
  }
}
