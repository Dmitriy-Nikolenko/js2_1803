console.log('Server is up and running..')

let fs = require('fs')
let express = require('express')

let server = express()

server.use(express.json())

// server.get('/', (reqeust, response) => {
//     response.send('We are online!')
// })

let catalogDB = './server/db/catalog.json'
let cartDB = './server/db/cart.json'

let cart = require('./cart.js')
let catalog = require('./catalog.js')

let writer = require('./writer.js')

server.get('/catalog', (req, res) => {
    fs.readFile(catalogDB, 'utf-8', (err,data) => {
        if (!err) {
            res.send(data)
        }
    })
})

server.get('/cart', (req, res) => {
    fs.readFile(cartDB, 'utf-8', (err,data) => {
        if (!err) {
            res.send(data)
        }
    })
})

server.post('/cart', (req, res) => {
    fs.readFile(cartDB, 'utf-8', (err, data) => {
        if(!err) {
            let newCart = cart.add(JSON.parse(data), req.body)
            writer(cartDB, newCart)
            .then(status => {
                if (status === true) {
                    res.json({status: 1})
                } else {
                    res.sendStatus(500, 'Error writing data')
                }
            })
        } else {
            res.sendStatus(404, 'DB catalog nout found')
        }
    })
})

server.post('/catalog', (req, res) => {
    //console.log(req.body)
    fs.readFile(catalogDB, 'utf-8', (err, data) => {
        //console.log(data)
        if(!err) {
            let {newCatalog, _id} = catalog.add(JSON.parse(data), req.body)
            writer(catalogDB, newCatalog)
            .then(status => {
                //console.log('stat', status)
                if (status === true) {
                    res.json({_id})
                } else {
                    res.sendStatus(500, 'Error writing data')
                }
            })
        } else {
            res.sendStatus(404, 'DB catalog nout found')
        }
    })
})

server.put('/cart/:id', (req, res) => {
    fs.readFile(cartDB, 'utf-8', (err, data) => {
        if(!err) {
            let newCart = cart.change(JSON.parse(data), req)
            writer(cartDB, newCart)
            .then(status => {
                if (status === true) {
                    res.json({status: 1})
                } else {
                    res.sendStatus(500, 'Error writing data')
                }
            })
        } else {
            res.sendStatus(404, 'DB catalog not found')
        }
    })   
})

server.delete('/cart/:id', (req, res) => {
    fs.readFile(cartDB, 'utf-8', (err, data) => {
        if(!err) {
            let newCart = cart.delete(JSON.parse(data), req)
            writer(cartDB, newCart)
            .then(status => {
                if (status === true) {
                    res.json({status: 1})
                } else {
                    res.sendStatus(500, 'Error writing data')
                }
            })
        } else {
            res.sendStatus(404, 'DB catalog nout found')
        }
    })   
})

server.listen(8080, () => {console.log('Server listening at port 8080..')})

// let newObj =     {
//     "id_product": 5,
//     "product_name": "SSD",
//     "price": 700
//   }

// let readFile = ''

// fs.readFile('./server/db/catalog.json', 'utf-8', (err, data) => {
//     if (!err) {
//         //readFile = data
//         let arr = JSON.parse(data)
//         arr.push(newObj)
//         writeTo(JSON.stringify(arr, null, ' '), './server/db/catalog.json')
//     } else {
//         console.log('ERROR READING FILE!')
//     }
// })

// function writeTo (obj, file) {
//     fs.writeFile(file, obj, (err) => {
//         if(err) {
//         console.log('ERROR WRITING TO FILE!')
//         }
//     })
// }


// setTimeout(() => {
//     console.log(readFile)
// }, 1000)