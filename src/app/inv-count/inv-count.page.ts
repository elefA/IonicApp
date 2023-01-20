import { Router } from '@angular/router';
import { SynchService } from '../../services/synch.service';
import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../../services/database.service';
import { GeneralService } from '../../services/general.service';
import { Zone } from '../classes/zone';

@Component({
  selector: 'app-inv-count',
  templateUrl: './inv-count.page.html',
})
export class InvCountPage implements OnInit {
  selectedZoneDescr: string;
  constructor(
    private db: DatabaseService,
    public general: GeneralService,
    public itemServ: SynchService,
    private router: Router
  ) {}

  ngOnInit() {
  }

  checkZone() {
    if (this.selectedZoneDescr) {
      this.general.selectedZone = this.general.zones.find(
        (x) => x.descr === this.selectedZoneDescr
      );
      this.router.navigate(['/inv-count01']);
    } else {
      alert('Παρακαλώ επιλέξτε ζώνη');
    }
  }
}
