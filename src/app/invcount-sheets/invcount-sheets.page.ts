import { SynchService } from 'src/services/synch.service';
import { InvcountService } from './../../services/invcount.service';
import { GeneralService } from './../../services/general.service';
import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/services/database.service';
import { Count01 } from '../classes/count';
import { Router } from '@angular/router';
import { Item } from '../classes/item';
import { Zone } from '../classes/zone';

@Component({
  selector: 'app-invcount-sheets',
  templateUrl: './invcount-sheets.page.html',
})
export class InvcountSheetsPage implements OnInit {
  isShow = true;
  isShow2 = true;
  constructor(
    public db: DatabaseService,
    private general: GeneralService,
    public invServ: InvcountService,
    public synch: SynchService,

    public invService: InvcountService
  ) {}

  ngOnInit() {
    this.invServ.getZones();
    this.invServ.getLockedZones();
  }

  loadZone(zone: string) {
    this.general.selectedZone = this.general.zones.find(
      (x) => x.descr === zone
    );
    if (!this.general.selectedZone) {
      this.general.selectedZone = this.general.lockedZones.find(
        (x) => x.descr === zone
      );
    }
  }
  deleteCount(zone: string) {
    if (
      confirm('Θα διαγραφούν όλες οι κινήσεις για το φύλλο απογραφής. Σίγουρα?')
    ) {
      this.db.deleteCount(zone).then((data) => {
        alert(data);
      });
    }
  }

  getCount01ZoneDescr(zoneDescr: string) {
    this.loadZone(zoneDescr);
    this.general.selectedZone= this.general.zones.find((x) => x.descr === zoneDescr);
    let id = this.general.selectedZone?.id;
    if (!id) {
      this.general.selectedZone= this.general.lockedZones.find((x) => x.descr === zoneDescr);
      id = this.general.selectedZone.id;
    }
    this.db.getCount01Zone(id, this.invService.sortByCode);
  }

  sendCount(zoneDescr: string) {
    this.getCount01ZoneDescr(zoneDescr);
  }

  toggleDisplay() {
    this.isShow = !this.isShow;
  }

  toggleDisplay2() {
    this.isShow2 = !this.isShow2;
  }
}
