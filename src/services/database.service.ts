/* eslint-disable @typescript-eslint/no-inferrable-types */
import { InvcountService } from './invcount.service';
/* eslint-disable @typescript-eslint/prefer-for-of */
import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { Item } from 'src/app/classes/item';
import { Count, Count01 } from '../app/classes/count';
import { GeneralService } from './general.service';
import { Zone } from 'src/app/classes/zone';
import { Mome } from 'src/app/classes/Mome';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  items: Item[];
  dbObject: SQLiteObject;
  liCount01: Count01[] = [];
  constructor(private sqlite: SQLite, private general: GeneralService) {}

  async createDatabase() {
    await this.sqlite
      .create({
        name: 'magazi-db',
        location: 'default',
      })
      .then((db: SQLiteObject) => {
        this.dbObject = db;
      })
      .catch((e) => {
        alert('error on creating db ' + JSON.stringify(e));
      });
    await this.createTables();
    this.addIP();
    this.getIP();
  }

  async createTables() {
    await this.dbObject.executeSql(
      'CREATE TABLE IF NOT EXISTS ITEMS ( ' +
        ' CODE VARCHAR(50) PRIMARY KEY,' +
        ' BARCODE VARCHAR(50) UNIQUE NOT NULL,' +
        ' DESCR  VARCHAR(255) NOT NULL, ' +
        ' MOME ΙΝΤ(2)     ) ',
      []
    );

    await this.dbObject.executeSql(
      'CREATE TABLE IF NOT EXISTS IP ( ' +
        ' ID INTEGER PRIMARY KEY, IP VARCHAR(50)' +
        ') ',
      []
    );

    await this.dbObject.executeSql(
      'CREATE TABLE IF NOT EXISTS ZONES ( ' +
        ' ID INTEGER PRIMARY KEY , ' +
        ' DESCR  VARCHAR(255) UNIQUE NOT NULL,' +
        ' LOCKED INTEGER(1) DEFAULT 0 ' +
        '  )',
      []
    );

    await this.dbObject.executeSql(
      'CREATE TABLE IF NOT EXISTS MOME ( ' +
        ' ID INTEGER PRIMARY KEY , ' +
        ' DESCR  VARCHAR(255)  NOT NULL' +
        '  )',
      []
    );

    await this.dbObject.executeSql(
      'CREATE TABLE IF NOT EXISTS COUNT ( ' +
        ' ID INTEGER PRIMARY KEY AUTOINCREMENT, ' +
        ' ZONE_ID  INTEGER NOT NULL,' +
        ' ZONE  VARCHAR(255) NOT NULL,' +
        ' DATE_CREATE TIMESTAMP   DEFAULT CURRENT_TIMESTAMP, ' +
        ' FOREIGN KEY (ZONE_ID) REFERENCES ZONES (ID) ON DELETE CASCADE ON UPDATE NO ACTION  ) ',
      []
    );

    await this.dbObject.executeSql(
      'CREATE TABLE IF NOT EXISTS COUNT01 ( ' +
        ' ID INTEGER PRIMARY KEY AUTOINCREMENT, ' +
        ' IDMASTER INTEGER NOT NULL,' +
        ' DATE_CREATE TIMESTAMP   DEFAULT CURRENT_TIMESTAMP,' +
        ' CODE VARCHAR(30) ,' +
        ' USER VARCHAR(30) ,' +
        ' BARCODE VARCHAR(50), ' +
        ' QUANT REAL(15,2), ' +
        ' FOREIGN KEY (BARCODE) REFERENCES ITEMS (BARCODE) ON DELETE CASCADE ON UPDATE NO ACTION   ,' +
        ' FOREIGN KEY (IDMASTER) REFERENCES COUNT (id) ON DELETE CASCADE ON UPDATE NO ACTION  ) ',
      []
    );
  }

  async addZone(id: number, descr: string) {
    return this.dbObject
      .executeSql(
        `INSERT INTO ZONES (ID,DESCR) VALUES (${id}, '${descr}');`,
        []
      )
      .then(() => 'Ζώνη δημιουργήθηκε!')
      .catch((e) => {
        if (e.code === 6) {
          return 'Η ζώνη με κωδικο ' + id + ' υπάρχει ήδη';
        }
        return 'Πρόβλημα στην προσθήκη ζώνης. ' + JSON.stringify(e);
      });
  }

  async addIP() {
    return this.dbObject
      .executeSql(
        `INSERT INTO IP (ID,IP) VALUES (1, '192.168.1.199:8080');`,
        []
      )
      .then(() => 'IP δημιουργήθηκε!')
      .catch((e) => {
        if (e.code === 6) {
          return 'IP υπάρχει ήδη';
        }
        return 'Πρόβλημα στην προσθήκη IP. ' + JSON.stringify(e);
      });
  }

  async updateIP(ip: string) {
    return this.dbObject
      .executeSql(`UPDATE  IP SET IP = '${ip}';`, [])
      .then(() => {
        this.getIP();
        return 'IP ενημερώθηκε!';
      })
      .catch((e) => {
        if (e.code === 6) {
          return 'IP υπάρχει ήδη';
        }
        return 'Πρόβλημα στην ενημέρωση IP. ' + JSON.stringify(e);
      });
  }

  async getIP() {
    return this.dbObject
      .executeSql(`SELECT IP FROM IP `, [])
      .then((res) => {
        for (let i = 0; i < res.rows.length; i++) {
          this.general.ipaddress = res.rows.item(i).IP;
        }
        return res.rows.item(0);
      })
      .catch((e) => 'Σφάλμα στην ανέρευση IP. ' + JSON.stringify(e));
  }

  async addMome(id: number, descr: string) {
    return this.dbObject
      .executeSql(`INSERT INTO MOME (ID,DESCR) VALUES (${id}, '${descr}');`, [])
      .then(() => 'Ζώνη δημιουργήθηκε!')
      .catch((e) => {
        if (e.code === 6) {
          return 'Η ζώνη με κωδικο ' + id + ' υπάρχει ήδη';
        }
        return 'Πρόβλημα στην προσθήκη ζώνης. ' + JSON.stringify(e);
      });
  }

  async getZones() {
    let temp: Zone;
    return this.dbObject
      .executeSql(`SELECT ID,DESCR,LOCKED FROM ZONES `, [])
      .then((res) => {
        this.general.zones = [];
        this.general.lockedZones = [];
        if (res.rows.length > 0) {
          for (let i = 0; i < res.rows.length; i++) {
            temp = Zone.adapt(res.rows.item(i));
            if (!temp.locked) {
              this.general.zones.push(temp);
            } else {
              this.general.lockedZones.push(temp);
            }
          }
        }
        return res;
      })
      .catch((e) => 'Σφάλμα στην ανέρευση των ζωνών. ' + JSON.stringify(e));
  }

  unlockZone(zone: Zone) {
    this.dbObject
      .executeSql(`UPDATE ZONES SET LOCKED = 0 WHERE ID=${zone.id}`, [])
      .then(() => {
        this.getZones();
      });
  }
  lockZone(zone: Zone) {
    this.dbObject
      .executeSql(`UPDATE ZONES SET LOCKED = 1 WHERE ID=${zone.id}`, [])
      .then(() => {
        this.getZones();
      });
  }

  async getMome() {
    return this.dbObject
      .executeSql(`SELECT ID,DESCR FROM MOME `, [])
      .then((res) => {
        console.log(res);
        this.general.momes = [];
        if (res.rows.length > 0) {
          for (let i = 0; i < res.rows.length; i++) {
            this.general.momes.push(Mome.adapt(res.rows.item(i)));
          }
        }
        return res;
      })
      .catch(
        (e) => 'Σφάλμα στην ανέρευση των μονάδων μέτρησης. ' + JSON.stringify(e)
      );
  }

  async getCounts(zoneID) {
    return this.dbObject
      .executeSql(
        `Select count(distinct c1.code) counts from count01 c1,count c,zones z where ` +
          ` c1.idmaster=c.id and c.zone_id=z.id and z.id = ${zoneID} `,
        []
      )
      .then((res) => res)
      .catch((e) =>
        console.log(
          'Σφάλμα στην ανέρευση των ζωνών με απογραφή. ' + JSON.stringify(e)
        )
      );
  }
  async deleteZone(id: number) {
    return this.dbObject
      .executeSql(`DELETE FROM ZONES WHERE id = ${id}`, [])
      .then(() => 'Η ζώνη διαγράφηκε')
      .catch((e) => 'Σφάλμα στην διαγραφή ζώνης. ' + JSON.stringify(e));
  }

  async addCount01(count01: Count01) {
    return (
      this.dbObject
        .executeSql(
          `INSERT INTO COUNT01 (IDMASTER,CODE,BARCODE,QUANT) VALUES (` +
            `'${count01.idmaster}',` +
            `'${count01.code}',` +
            `'${count01.barcode}',` +
            `'${count01.quant}'` +
            `)`,
          []
        )
        // eslint-disable-next-line arrow-body-style
        .then((row: any) => {
          this.general.msgToast('Το είδος προστέθηκε στην απογραφή!', 1500);
          return row.insertId;
        })
        .catch(
          (e) =>
            'Πρόβλημα στην προσθήκη κίνησης απογραφής. ' + JSON.stringify(e)
        )
    );
  }

  async getCount01(idmaster: number) {
    return this.dbObject
      .executeSql(`SELECT * FROM COUNT01 WHERE IDMASTER = '${idmaster}'`, [])
      .then((res) => res)
      .catch(
        (e) =>
          'Σφάλμα στην ανέρευση των κινήσεων απογραφής. ' + JSON.stringify(e)
      );
  }

  async deleteCount01(idmaster: number, id: number) {
    return this.dbObject
      .executeSql(
        `DELETE FROM COUNT01 WHERE idmaster = ${idmaster} ` +
          `and code in (select code from count01 where id = ${id} ) `,
        []
      )
      .then(() => 'Η κίνηση απογραφής διαγράφηκε')
      .catch(
        (e) => 'Σφάλμα στην διαγραφή κίνησης απογραφής. ' + JSON.stringify(e)
      );
  }
  async deleteCount(zone: string) {
    return this.dbObject
      .executeSql(`DELETE FROM COUNT `, [])
      .then(
        () => 'Το φυλλο απογραφής απογραφής για την ζώνη ' + zone + 'διαγράφηκε'
      )
      .catch(
        (e) => 'Σφάλμα στην διαγραφή φυλλο απογραφής. ' + JSON.stringify(e)
      );
  }
  async updateCount01(count01: Count01) {
    return this.dbObject
      .executeSql(
        `UPDATE  COUNT01 SET QUANT='${count01.quant}' WHERE id = ${count01.id}`,
        []
      )
      .then(() => 'Η κίνηση απογραφής ενημερώθηκε')
      .catch(
        (e) => 'Σφάλμα στην ενημέρωση κίνησης απογραφής. ' + JSON.stringify(e)
      );
  }

  async getMaxCount(zone: string) {
    //Φερνω την τελευταια απογραφη για μία ζώνη
    return this.dbObject
      .executeSql(`SELECT MAX(ID) FROM COUNT WHERE ZONE = '${zone}' `, [])
      .then((res) => res)
      .catch(
        (e) =>
          'Σφάλμα στην ανέρευση των κινήσεων απογραφής. ' + JSON.stringify(e)
      );
  }

  async addCount(zone: string, zoneID: number) {
    return (
      this.dbObject
        .executeSql(
          `INSERT INTO COUNT (ZONE,ZONE_ID) VALUES ('${zone}',${zoneID})`,
          []
        )
        // eslint-disable-next-line arrow-body-style
        .then((row: any) => {
          return row.insertId;
        })
        .catch(
          (e) =>
            'Πρόβλημα στην προσθήκη νέου φύλλου απογραφής. ' + JSON.stringify(e)
        )
    );
  }

  async getCount(zoneID: number) {
    return this.dbObject
      .executeSql(`SELECT * FROM COUNT WHERE ZONE_ID = '${zoneID}'`, [])
      .then((res) => res)
      .catch(
        (e) =>
          'Σφάλμα στην ανέρευση του πατερα των κινήσεων απογραφής. ' +
          JSON.stringify(e)
      );
  }

  async addItem(item: Item, index: number) {
    const sqlStart = `INSERT INTO ITEMS (CODE,BARCODE,DESCR`;
    const sqlMome = `,MOME`;
    const sqlEnd = `)`;
    const valSql1 =
      ` VALUES ('${item.code}',` + `'${item.barcode}',` + `'${item.descr}'`;
    const valSqlMome = `,${item.mome}`;
    let sql = sqlStart;
    if (item.mome != null) {
      sql += sqlMome;
    }
    sql += sqlEnd + valSql1;
    if (item.mome) {
      sql += valSqlMome;
    }
    sql += sqlEnd;
    return this.dbObject
      .executeSql(sql, [])
      .then(() => {
        if (index === this.items.length - 1) {
          alert('Τα είδη προστέθηκαν!');
        }
        return;
      })
      .catch((e) => {
        if (e.code === 6) {
          return 'Το είδος με κωδικο ' + item.code + ' υπάρχει ήδη';
        }
        return 'Πρόβλημα στην προσθήκη είδους. ' + JSON.stringify(e);
      });
  }

  async getItemByBarcode(text: string) {
    if (text === '') {
      return;
    }
    return this.dbObject
      .executeSql(
        `SELECT * FROM ITEMS WHERE BARCODE = '${text}' AND NOT EXISTS ` +
          ` (SELECT 1 FROM ITEMS WHERE CODE LIKE '${text}%')`,
        []
      )
      .then((res) => res)
      .catch((e) =>
        console.log(
          'Σφάλμα στην ανέρευση είδους με barcode. ' + JSON.stringify(e)
        )
      );
  }

  //Search with descr or code.
  async getItems(text: string, textString: string) {
    let flag1: boolean;
    let flag2: boolean;
    flag1 = false;
    flag2 = false;
    let textUpperCase: string;
    let sql: string = ``;
    if (text.length > 2) {
      flag1 = true;
    }

    if (textString.length > 2) {
      flag2 = true;
      textUpperCase = textString.toUpperCase();
    }
    sql += `SELECT * FROM ITEMS WHERE 1=1 AND `;
    if (flag1) {
      if (flag2) {
        sql += `  (`;
      }
      sql += `  (CODE LIKE '${text}%' OR BARCODE = '${text}') `;
      if (flag2) {
        sql += ` AND `;
      }
    }
    if (flag2) {
      sql += `  ( DESCR LIKE '%${textString}%' OR DESCR LIKE '%${textUpperCase}%')  `;

      if (flag1) {
        sql += `)`;
      }
    }
    console.log(sql);

    return this.dbObject
      .executeSql(sql, [])
      .then((res) => res)
      .catch(
        (e) =>
          'Σφάλμα στην ανέρευση ειδών με κωδικό ή περιγραφή. ' +
          JSON.stringify(e)
      );
  }

  async getCount01Barcode(barcode: string, zoneID: number) {
    return this.dbObject
      .executeSql(
        `SELECT A.ID,SUM(A.QUANT) QUANT,A.CODE,A.BARCODE,B.DESCR,B.MOME FROM COUNT01 A, ITEMS B,COUNT C ` +
          ` WHERE A.BARCODE ='${barcode}' AND A.BARCODE = B.BARCODE AND A.IDMASTER = C.ID AND C.ZONE_ID='${zoneID}' GROUP BY A.CODE  `,
        []
      )
      .then((res) => res)
      .catch(
        (e) =>
          'Σφάλμα στην ανέρευση ειδών με κωδικό ή περιγραφή. ' +
          JSON.stringify(e)
      );
  }

  async updCount01(quant: number, barcode: string) {
    return (
      this.dbObject
        .executeSql(
          `UPDATE COUNT01 SET QUANT = ${quant} WHERE BARCODE ='${barcode}'`,
          []
        )
        // eslint-disable-next-line arrow-body-style
        .then(() => {
          return;
        })
        .catch((e) => 'Προβλημα στον updCount01 ' + JSON.stringify(e))
    );
  }
  async getCount01Zone(zoneID: number, sortByCode: boolean) {
    let sql =
      `SELECT A.ID,SUM(A.QUANT) QUANT,A.CODE,I.DESCR,I.MOME,A.IDMASTER,A.DATE_CREATE FROM COUNT01 A, COUNT B, ITEMS I WHERE ` +
      `A.BARCODE=I.BARCODE AND ` +
      `A.IDMASTER=B.ID AND B.ZONE_ID=${zoneID} ` +
      ` GROUP BY A.CODE ORDER BY  `;
    sql += sortByCode ? ` A.CODE  ` : ` MAX(A.DATE_CREATE) DESC `;
    return this.dbObject
      .executeSql(sql, [])
      .then((res) => {
        let temp: Count01;
        this.liCount01 = [];
        for (let i = 0; i < res.rows.length; i++) {
          temp = new Count01();
          temp.id = res.rows.item(i).ID;
          temp.idmaster = res.rows.item(i).IDMASTER;
          temp.descr = res.rows.item(i).DESCR;
          temp.code = res.rows.item(i).CODE;
          temp.quant = res.rows.item(i).QUANT;
          temp.mome = res.rows.item(i).MOME;
          temp.dateCreate = res.rows.item(i).DATE_CREATE;
          this.liCount01.push(temp);
        }

        return res;
      })
      .catch(
        (e) =>
          'Σφάλμα στην ανέρευση ειδών με κωδικό ή περιγραφή. ' +
          JSON.stringify(e)
      );
  }

  clearCount01Forgotten() {
    return (
      this.dbObject
        .executeSql(
          `DELETE FROM COUNT01 WHERE IDMASTER IN (SELECT ID FROM COUNT WHERE ZONE_ID=666)  `,
          []
        )
        // eslint-disable-next-line arrow-body-style
        .then(() => {
          return;
        })
        .catch((e) => 'Προβλημα στον updCount01 ' + JSON.stringify(e))
    );
  }

  getItem(itemCode) {
    return this.dbObject
      .executeSql(`SELECT * FROM ITEMS WHERE CODE = '${itemCode}'`, [])
      .then((res) => {
        console.log(res.rows.length);
        return res;
      })
      .catch((e) =>
        console.log('Σφάλμα στην ανέρευση του ειδους. ' + JSON.stringify(e))
      );
  }
}
