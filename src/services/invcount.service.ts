import { DatabaseService } from 'src/services/database.service';
import { Injectable } from '@angular/core';
import { Invcount } from 'src/app/classes/Invcount';
import { Item } from 'src/app/classes/item';
import { GeneralService } from './general.service';

@Injectable({
  providedIn: 'root',
})
export class InvcountService {
  sortByCode = false;
  scanned: Invcount[];
  selectedItem: Item;
  searchString = '';
  searchTextString='';
  results: Item[] = new Array<Item>();
  lockedZonesCount: { zoneDescr; count }[] = new Array<{
    zoneDescr: any;
    count: any;
  }>();
  zonesCount: { zoneDescr; count }[] = new Array<{
    zoneDescr: any;
    count: any;
  }>();
  constructor(private db: DatabaseService, private general: GeneralService) {}

  getZones() {
    this.zonesCount = [];
    this.general.zones.forEach((element, index) => {
      this.db.getCounts(element.id).then((data) => {
        if (data.rows.length > 0) {
          this.zonesCount.push({
            zoneDescr: element.descr,
            count: data.rows.item(0).counts,
          });
        }
      });
    });
  }
  getLockedZones() {
    this.lockedZonesCount = [];
    this.general.lockedZones.forEach((element, index) => {
      console.log(element.descr);
      this.db.getCounts(element.id).then((data) => {
        if (data.rows.length > 0) {
          this.lockedZonesCount.push({
            zoneDescr: element.descr,
            count: data.rows.item(0).counts,
          });
        }
      });
    });
  }

  getMome(momeId: number): string {
    if (momeId != null) {
      const momeDescr = this.general.momes.find((x) => x.id === momeId).descr;
      return momeDescr;
    }
    return '';
  }
}
