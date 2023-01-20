export class Zone {
  id: number;
  descr: string;
  locked: boolean;

  static adapt(data): Zone {
    const zone=new Zone();
    zone.id = data.ID;
    zone.descr=data.DESCR;
    zone.locked = data.LOCKED>0;
    return zone;

  }

  static adapt1(data): Zone {
    const zone=new Zone();
    zone.id = data.id;
    zone.descr=data.descr;
    return zone;
  }
}
