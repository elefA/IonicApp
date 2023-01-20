import { Router } from '@angular/router';
import { DatabaseService } from 'src/services/database.service';
import { InvcountService } from './../../services/invcount.service';
import { GeneralService } from 'src/services/general.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Count01 } from '../classes/count';
import { Item } from '../classes/item';

@Component({
  selector: 'app-insert-quant',
  templateUrl: './insert-quant.page.html',
  styleUrls: ['./insert-quant.page.scss']
})
export class InsertQuantPage implements OnInit {
  @ViewChild('input') iQuant;
  previousQuant = 0;
  quant: number;
  item: Item;
  momeDescr: string;

  constructor(
    public general: GeneralService,
    public invService: InvcountService,
    private db: DatabaseService,
    private router: Router
  ) {}

  ionViewWillEnter() {
    if (this.invService.selectedItem.mome > 1) {
      this.general.msgToast(
        'Το είδος μετριέται σε ' +
          this.invService.getMome(this.invService.selectedItem.mome),
        4000
      );
    }
    setTimeout(() => {
      this.iQuant.setFocus();
    }, 150);
  }
  ngOnInit() {
    this.item = this.invService.selectedItem;
    if (this.invService.selectedItem.mome) {
      this.momeDescr = this.general.momes.find(
        (x) => x.id === this.invService.selectedItem.mome
      ).descr;
    }
    this.db
      .getCount01Barcode(this.item.barcode, this.general.selectedZone.id)
      .then((res) => {
        if (res.rows.length > 0) {
          this.previousQuant = res.rows.item(0).QUANT;
        }
      });
  }

  async addInvcount() {
    let idmaster;
    await this.db.getCount(this.general.selectedZone.id).then((data) => {
      if (data.rows.length === 0) {
        this.db
          .addCount(
            this.general.selectedZone.descr,
            this.general.selectedZone.id
          )
          .then((id) => {
            idmaster = id;
            this.addCount01(idmaster);
          });
      } else {
        idmaster = data.rows.item(0).ID;
        this.addCount01(idmaster);
      }
      this.invService.searchString = '';
      this.invService.results = [];
    });
  }

  addCount01(idmaster: number) {
    console.log(this.item.code + ' aaa');
    const count01: Count01 = new Count01();
    count01.idmaster = idmaster;
    count01.barcode = this.item.barcode;
    count01.code = this.item.code;
    count01.quant = this.quant;
    this.db.addCount01(count01).then((res) => res);
    if (this.general.fromForm === 'sheets') {
      if (this.general.selectedZone) {
        this.db.getCount01Zone(
          this.general.selectedZone.id,
          this.invService.sortByCode
        );
      }
      this.router.navigate(['/invcount-sheets']);
    } else {
      this.router.navigate(['/inv-count01']);
    }
  }
}
