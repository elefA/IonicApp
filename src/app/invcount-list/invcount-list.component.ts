import { InvcountService } from './../../services/invcount.service';
import { GeneralService } from 'src/services/general.service';
import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/services/database.service';
import { Item } from '../classes/item';
import { Router } from '@angular/router';

@Component({
  selector: 'app-invcount-list',
  templateUrl: './invcount-list.component.html',
  styleUrls: ['./invcount-list.component.scss'],
})
export class InvcountListComponent implements OnInit {
  constructor(
    public general: GeneralService,
    public invService: InvcountService,
    public db: DatabaseService,
    private route: Router
  ) {}

  ngOnInit() {
    if (this.general.selectedZone) {
      this.getCount01Zone();
    }
  }
  getCount01Zone() {
    this.db
      .getCount01Zone(this.general.selectedZone.id,  this.invService.sortByCode)
      .then((res) => {
        console.log(res);
      });
  }

  deleteCount01(idmaster: number, id: number) {
    this.db.deleteCount01(idmaster, id).then((res) => {
      this.getCount01Zone();
      this.invService.getZones();
    });
  }
  selectItem(itemCode: string) {
    let item: Item;
    this.db.getItem(itemCode).then((res) => {
      item = new Item();
      item.code = res.rows.item(0).CODE;
      item.mome = res.rows.item(0).MOME;
      item.barcode = res.rows.item(0).BARCODE;
      item.descr = res.rows.item(0).DESCR;
      this.invService.selectedItem = item;
      this.general.fromForm = 'sheets';
      this.route.navigate(['/insert-quant']);
    });
  }

  sortBy() {
    this.invService.sortByCode=!this.invService.sortByCode;
    this.getCount01Zone();

  }
}
