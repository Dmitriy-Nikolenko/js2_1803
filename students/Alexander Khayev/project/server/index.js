console.log("Hello, I'm server");

let fs = require('fs')
let express = require('express');

let server = express();
server.use(express.json());

const Catalog = require('./catalog.js');
const Basket = require('./basket.js');
const db = require('./db.js');


server.get('/', (request, response) => {
  response.send('Hello "Teapot" :)');
})

//*** Factory ***************************************************************************************

class Factory {
  constructor() {
  }

  // catalog by Promises & Classes, for test
  static getCatalog() {
    return new Promise((res, rej) => {
      let catalog = new Catalog([]);
      catalog.read(obj => res(obj), err => rej(err))
    })
  }

  // basket by callbacks & functions
  static getBasket(okCb = null, errCb = null) {
    db.readFromDB("./server/db/getBasket.json",
      data => okCb(new Basket(data)), errCb)
  }
}

//*** Catalog methods *******************************************************************************

// return all catalog
server.get('/catalog.json', (req, res) => {
  Factory.getCatalog()
    .then(cat => {
      res.send(cat.data)
    })
})

// create new item in catalog
server.post('/addtocatalog.json', (req, res) => {
  Factory.getCatalog()
    .then(catalogObj => catalogObj.push(req.body)
      .then(() => catalogObj.save()
        .then(() => res.send(catalogObj.data))
        .catch(() => res.sendStatus(500, 'wrong saving data'))))
    .catch(err => res.sendStatus(500, 'catalog not found'))
})

//*** Basket methods ********************************************************************************

server.get('/basket.json', (req, res) => {
  Factory.getBasket(
    basket => res.send(basket.data),
    err => res.sendStatus(500, "get basket failed")
  )
})

// remove item from basket fully
server.delete('/delbasket.json/:id', (request, response) => {
  Factory.getBasket(
    basket => {
      if (basket.delete(+request.params.id)) {
        basket.save()
          .then(() => response.send({'result': 1}))
          .catch(err => response.send({'result': 0}))
      } else {
        response.sendStatus(500, 'wrong removed item')
      }
    },
    err => response.send({'result': 0})
  );
})

// put new item to basket
server.post('/tobasket.json', (req, res) => {
  Factory.getBasket(
    basket => {
      if (basket.addNew(Object.assign({}, req.body, {quantity: 1})))
      {
        basket.save()
          .then(() => res.send({'result': 1}))
          .catch(err => res.send({'result': 0}))
      } else {
        res.sendStatus(500, "Can't create existing item")
      }
    },
    err => res.json({'result': 0})
  )
})

// change quantity for item in basket
server.put('/changecart.json/:id', (req, res) => {
  Factory.getBasket(
    basket => {
      if (basket.changeQuantity(+req.params.id, +req.body.delta)) {
        basket.save()
          .then(() => res.send({'result': 1}))
          .catch(err => res.send({'result': 0}))
      }else{
        res.sendStatus(500, "Can't remove unexisting item")
      }
    },
    err => res.json({'result': 0})
  )
})

server.listen(8880, () => {
  console.log('server listen @8880...');
});


