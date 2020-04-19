const db = require('./db.js')

module.exports = class Catalog {
  constructor(data) {
    this.data = data;
  }

  async push(item) {
    let id = 1 + Math.max(...this.data.map(el => el.id_product));
    this.data.push(Object.assign({}, item, {id_product: id}));
  }

  async save() {
    return new Promise((res, rej)=>{
      db.saveToDB(this.data, "./server/db/catalogData.json",
        data=>res(data),
        err=>rej(err)
      )
    })
  }

  read(okCb, errCb) {
    db.readFromDB("./server/db/catalogData.json",
      ok=> {
        this.data = ok;
        okCb(this);
      }, errCb);
  }

}
