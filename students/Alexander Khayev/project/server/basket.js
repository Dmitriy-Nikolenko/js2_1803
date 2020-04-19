const db = require("./db.js")

module.exports = class Basket{
  constructor(data) {
    this.data = data;
  }

  delete(id) {
    let oldBasket = this.data.contents
    this.data.contents = oldBasket.filter(b => b.id_product !== id);
    return (oldBasket.length !== this.data.contents.length)
  }

  async save() {
    return new Promise((res, rej)=> {
      db.saveToDB(this.data, "./server/db/getBasket.json",
        () => res(true), () => rej(false))
    })
  }

  addNew(newItem) {
    let inBasket = this.data.contents.find(b => b.id_product === newItem.id_product);
    if (!inBasket) { // товара не должно быть в корзине
      this.data.contents.push(Object.assign({}, newItem, {quantity: 1}));
      return true;
    }

    return false;
  }

  changeQuantity(id, delta) {
    let inBasket = this.data.contents.find(b => b.id_product === id);
    if (inBasket.quantity + delta > 0) {
      inBasket.quantity += delta;
     return true;
    }
    return false;
    }
}
