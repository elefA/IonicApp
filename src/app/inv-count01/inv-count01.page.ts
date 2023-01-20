import { InvcountService } from './../../services/invcount.service';
import { Component, OnDestroy, ViewChild } from '@angular/core';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { DatabaseService } from 'src/services/database.service';
import { Item } from '../classes/item';
import { Router } from '@angular/router';
import { GeneralService } from 'src/services/general.service';

@Component({
  selector: 'app-inv-count01',
  templateUrl: './inv-count01.page.html',
})
export class InvCount01Page implements OnDestroy {
  @ViewChild('input') myInput;
  menuClicked = false;
  searching = false;

  constructor(
    private keyboard: Keyboard,
    public db: DatabaseService,
    public invService: InvcountService,
    private general: GeneralService,
    private route: Router
  ) {
    this.db.createDatabase();
  }
  ionViewWillEnter() {
    this.invService.searchString = '';
    this.invService.searchTextString = '';
    setTimeout(() => {
      this.myInput.setFocus();
    }, 150);
    // setTimeout(() => {
    //   this.keyboard.hide();
    // }, 222);
  }

  ngOnDestroy() {
    this.invService.results = [];
    this.invService.selectedItem = null;
    this.db.liCount01 = [];
  }

  onFocus() {
    this.searching = true;
  }
  onCancel() {
    this.invService.results = [];
    this.invService.selectedItem = null;
  }

  searchItem() {
    setTimeout(() => {
      this.searching = false;
      if (!this.menuClicked) {
        if (
          this.invService.searchString.length > 2 ||
          this.invService.searchTextString.length > 2
        ) {
          this.invService.results = [];
          this.invService.selectedItem = null;
          this.db
                  .getItems(
                    this.invService.searchString,
                    this.invService.searchTextString
                  )
                  .then((data1) => {
                    if (data1.rows.length > 0) {
                      for (let i = 0; i < data1.rows.length; i++) {
                        const tempItem = new Item();
                        tempItem.code = data1.rows.item(i).CODE;
                        tempItem.descr = data1.rows.item(i).DESCR;
                        tempItem.barcode = data1.rows.item(i).BARCODE;
                        tempItem.mome = data1.rows.item(i).MOME;
                        this.invService.results.push(tempItem);
                      }
                    } else {
                      this.invService.searchString = '';
                      this.invService.searchTextString = '';
                      this.general.msgToast(
                        'Δεν βρέθηκαν είδη που να ταιριάζουν.',
                        1821
                      );
                      this.myInput.setFocus();
                    }
                  });
          // this.db
          //   .getItemByBarcode(this.invService.searchString)
          //   .then((data) => {
          //     if (
          //       this.invService.searchString === '' ||
          //       data.rows.length === 0
          //     ) {
          //       this.db
          //         .getItems(
          //           this.invService.searchString,
          //           this.invService.searchTextString
          //         )
          //         .then((data1) => {
          //           if (data1.rows.length > 0) {
          //             for (let i = 0; i < data1.rows.length; i++) {
          //               const tempItem = new Item();
          //               tempItem.code = data1.rows.item(i).CODE;
          //               tempItem.descr = data1.rows.item(i).DESCR;
          //               tempItem.barcode = data1.rows.item(i).BARCODE;
          //               tempItem.mome = data1.rows.item(i).MOME;
          //               this.invService.results.push(tempItem);
          //             }
          //           } else {
          //             this.invService.searchString = '';
          //             this.invService.searchTextString = '';
          //             this.general.msgToast(
          //               'Δεν βρέθηκαν είδη που να ταιριάζουν.',
          //               1821
          //             );
          //             this.myInput.setFocus();
          //           }
          //         });
          //     } else if (data.rows.length > 0) {
          //       const tempItem = new Item();
          //       tempItem.code = data.rows.item(0).CODE;
          //       tempItem.barcode = data.rows.item(0).BARCODE;
          //       tempItem.descr = data.rows.item(0).DESCR;
          //       tempItem.mome = data.rows.item(0).MOME;
          //       this.invService.selectedItem = tempItem;
          //       this.route.navigate(['/insert-quant']);
          //     }
          //   });
        }
      } else {
        this.menuClicked = false;
      }
    }, 400);
  }

  selectItem(item: Item) {
    if (!this.searching) {
      if (item.mome == null) {
        if (
          !confirm('Αυτό δεν είναι είδος απογραφής - Θέλετε να απογραφεί; ')
        ) {
          return;
        }
      }
      this.invService.selectedItem = item;
      this.general.fromForm = '';
      this.route.navigate(['/insert-quant']);
    }
  }
  reset() {
    this.db.createDatabase();
  }
  menuClick() {
    this.menuClicked = true;
  }
}
