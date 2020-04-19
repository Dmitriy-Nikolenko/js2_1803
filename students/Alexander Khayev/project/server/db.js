let fs = require('fs')

module.exports = {

  saveToDB(data, file, cbOk, cbErr) {
    fs.writeFile(file, JSON.stringify(data, null, " "), err => {
      if (err) {
        cbErr(err)
      } else {
        cbOk()
      }
    })
  },

  readFromDB(file, cbOk, cbErr) {
    fs.readFile(file, 'utf-8', (err, data) => {
      if (err) {
        cbErr(err)
      } else {
        cbOk(JSON.parse(data));
      }
    })
  },

}
