export class Mome {
  id: number;
  descr: string;

  static adapt(data): Mome {
    const mome = new Mome();
    mome.id = data.ID;
    mome.descr = data.DESCR;
    return mome;
  }

  static adapt1(data): Mome {
    const mome = new Mome();
    mome.id = data.id;
    mome.descr = data.descr;
    return mome;
  }
}
