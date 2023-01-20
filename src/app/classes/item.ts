export class Item{
    code: string;
    barcode: string;
    descr: string;
    mome: number;

    adapt(x: any): Item{
      const item = new Item();
      item.code = x.id;
      item.barcode = x.barcode;
      item.descr = x.descr;
      item.mome = x.mome;
      return item;
    }
}
