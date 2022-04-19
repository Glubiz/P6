const fs = require('fs')

const Snapshot = () => {
    var Chain = JSON.parse(fs.readFileSync('./middleware/Blockchain/Storage/Master.json'))
    var now = new Date().getTime().toString()
    fs.writeFileSync('./middleware/Blockchain/Storage/Snaps' + now + '.json', JSON.stringify(Chain, null, 4))

    return new Promise((resolve) => {
        resolve()
    });
}

setInterval(Snapshot, 900 * 1000)

module.exports = Snapshot