let fs = require('fs')

module.exports = async function (file, data) {
    let stat = true
    try {
        fs.writeFile(file, JSON.stringify(data, null, 2), (err) => {
            if(err) {
                stat = false
            }
        })
    }
    finally {
        return stat
    }
}