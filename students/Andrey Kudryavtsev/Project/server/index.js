let fs = require('fs')
let express = require('express')

let server = express()

let catalogDB = './server/db/catalog.json'
let cartDB = './server/db/cart.json'

let cart = require('./cart.js')
let catalog = require('./catalog.js')

let writer = require('./writer.js')

server.use(express.json())

server.listen(8080, () => { console.log('server listen @ 8080...') })

server.get('/catalog', (req, res) => {
    fs.readFile(catalogDB, 'utf-8', (err, data) => {
        if(!err) {
            res.send(data)
        }
    })
})

server.get('/cart', (req, res) => {
    fs.readFile(cartDB, 'utf-8', (err, data) => {
        if(!err) {
            res.send(data)
        }
    })
})

server.post('/cart', (req, res) => {
    fs.readFile (cartDB, 'utf-8', (err, data) => {
        if(!err) {
            let newCart = cart.add(JSON.parse(data), req.body)
            writer(cartDB, newCart)
            .then(status => {
                if (status === true) {
                    res.json({status: 1})
                } else {
                    res.sendStatus(500, 'Error write data')
                }
            })
        } else {
            res.sendStatus(404, 'DB catalog not found')
        }
    })
})

server.post('/catalog', (req, res) => {
    
    fs.readFile (catalogDB, 'utf-8', (err, data) => {
        if(!err) {
            let {newCatalog, _id} = catalog.add(JSON.parse(data), req.body)
            writer(catalogDB, newCatalog)
            .then(status => {
                if (status === true) {
                    res.json({_id})
                } else {
                    res.sendStatus(500, 'Error write data')
                }
            })
        } else {
            res.sendStatus(404, 'DB catalog not found')
        }
    })
})

server.put('/cart/:id', (req, res) => {
    fs.readFile (cartDB, 'utf-8', (err, data) => {
        if(!err) {
            let newCart = cart.change(JSON.parse(data), req)
            writer(cartDB, newCart)
            .then(status => {
                if (status === true) {
                    res.json({status: 1})
                } else {
                    res.sendStatus(500, 'Error write data')
                }
            })
        } else {
            res.sendStatus(404, 'DB catalog not found')
        }
    })
})

server.delete('/cart/:id', (req, res) => {
    fs.readFile (cartDB, 'utf-8', (err, data) => {
        if(!err) {
            let newCart = cart.delete(JSON.parse(data), req)
            writer(cartDB, newCart)
            .then(status => {
                if (status === true) {
                    res.json({status: 1})
                } else {
                    res.sendStatus(500, 'Error write data')
                }
            })
        } else {
            res.sendStatus(404, 'DB catalog not found')
        }
    })
})