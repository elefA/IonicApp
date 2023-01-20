/* eslint-disable @typescript-eslint/naming-convention */
import { Count01 } from './../app/classes/count';
import { GeneralService } from 'src/services/general.service';
import { DatabaseService } from './database.service';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { Item } from 'src/app/classes/item';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Zone } from 'src/app/classes/zone';
import { Mome } from 'src/app/classes/Mome';

@Injectable({
  providedIn: 'root',
})
export class SynchService {
  adapter: Item = new Item();
  clicked = false;
  url;
  constructor(
    private http: HttpClient,
    private db: DatabaseService,
    private general: GeneralService
  ) {}

  getItems(): Observable<any> {
    this.general.msgToast(
      'Παρακαλώ περιμένετε.. Θα ειδοποιηθείτε όταν τελειώσει',
      10000
    );
    this.db.items = [];
    let resolved = false;
    this.url = 'http://' + this.general.ipaddress + '/api/items';
    return this.http.get(this.url).pipe(
      map((data: any) => {
        data.map((item: any) => {
          this.db.items.push(this.adapter.adapt(item));
        });
        const bar = new Promise<void>((resolve, reject) => {
          this.db.items.forEach((element, index) => {
            this.db.addItem(element, index);
            if (index === this.db.items.length - 1) {
              resolved = true;
              resolve();
            }
          });
        });
        bar.then(() => {
          if (resolved) {
            this.general.msgToast(
              'Γεια σου, τι κανεις Μπαμπά? Περίμενε λιγο ακομά θέλει',
              1500
            );
          }
        });
        return;
      }),
      catchError(this.handleError)
    );
  }

  getZones(): Observable<any> {
    let resolved = false;
    this.url = 'http://' + this.general.ipaddress + '/api/zones';
    console.log(this.url);
    return this.http.get(this.url).pipe(
      map((data: any) => {
        data.map((zone: any) => {
          this.general.zones.push(Zone.adapt1(zone));
        });
        const bar = new Promise<void>((resolve, reject) => {
          this.general.zones.forEach((element, index) => {
            this.db.addZone(element.id, element.descr);
            if (index === this.general.zones.length - 1) {
              resolved = true;
              resolve();
            }
          });
        });
        bar.then(() => {
          if (resolved) {
            alert('Οι ζώνες προστέθηκαν επιτυχώς!');
          }
        });
        return;
      }),
      catchError(this.handleError)
    );
  }

  getMome(): Observable<any> {
    let resolved = false;
    this.url = 'http://' + this.general.ipaddress + '/api/momes';
    return this.http.get(this.url).pipe(
      map((data: any) => {
        data.map((mome: any) => {
          this.general.momes.push(Mome.adapt1(mome));
        });
        const bar = new Promise<void>((resolve, reject) => {
          this.general.momes.forEach((element, index) => {
            this.db.addMome(element.id, element.descr);
            if (index === this.general.momes.length - 1) {
              resolved = true;
              resolve();
            }
          });
        });
        bar.then(() => {
          if (resolved) {
            alert('Οι μονάδες μέτρησης προστέθηκαν επιτυχώς!');
          }
        });
        return;
      }),
      catchError(this.handleError)
    );
  }

  handleError(error) {
    alert(error.message || 'Server Error');
    return throwError(error.message || 'Server Error');
  }

  postCount01() {
    let itemsPosted = 0;
    let itemsProcessed = 0;
    this.general.msgToast(this.general.selectedZone.descr, 2000);
    this.url = 'http://' + this.general.ipaddress + '/api/invcounts';
    this.db.liCount01.forEach((item1) => {
      itemsProcessed++;
      this.http
        .post<{
          item: string;
          quant: number;
          zone: string;
          username: string;
          zone_id: number;
        }>(this.url, {
          item: item1.code,
          quant: item1.quant,
          zone: this.general.selectedZone.descr,
          username: this.general.selectedUser,
          zone_id: this.general.selectedZone.id,
        })
        .subscribe(
          () => {
            itemsPosted++;
            this.general.msgToast(
              itemsPosted +
                '/' +
                this.db.liCount01.length +
                ' απο τις καταμετρήσεις ειδών στάλθηκαν επιτυχώς  ',
              3500
            );
            if (itemsPosted === this.db.liCount01.length) {
              this.general.msgToast('Η λίστα απεστάλη με επιτυχία', 3500);
              this.db.lockZone(this.general.selectedZone);
              this.clicked = false;
            } else if (itemsPosted === 0 && itemsProcessed===this.db.liCount01.length) {
              this.general.msgToast('Κανένα στοιχείο δεν στάλθηκε!', 3500);
              this.clicked = false;
            }
          },
          (error1) => {
            this.general.msgToast(
              'Υπήρχε κάποιο πρόβλημα στην αποστολή του είδους ' + item1.code,
              2000
            );
          }
        );
    });
    return;
  }

  postCountSum() {
    let itemsPosted = 0;
    let itemsProcessed = 0;
    this.general.msgToast(this.general.selectedZone.descr, 2000);
    this.url = 'http://' + this.general.ipaddress + '/api/InvcountSums';
    this.db.liCount01.forEach((item1) => {
      itemsProcessed++;
      this.http
        .post<{
          item: string;
          quant: number;
        }>(this.url, {
          item: item1.code,
          quant: item1.quant,
        })
        .subscribe(
          () => {
            itemsPosted++;
            if (itemsPosted === this.db.liCount01.length) {
              this.general.msgToast('Η λίστα απεστάλη με επιτυχία', 3500);
              this.db.lockZone(this.general.selectedZone);
              this.db.clearCount01Forgotten();
            } else if (itemsPosted === 0) {
              this.general.msgToast('Κανένα στοιχείο δεν στάλθηκε!', 3500);
            }
            this.general.msgToast(
              itemsPosted +
                '/' +
                this.db.liCount01.length +
                ' απο τις καταμετρήσεις ειδών στάλθηκαν επιτυχώς  ',
              3500
            );
          },
          (error1) => {
            this.general.msgToast(
              'Υπήρχε κάποιο πρόβλημα στην αποστολή του είδους ' + item1.code,
              2000
            );
          }
        );
    });
    return;
  }
}
