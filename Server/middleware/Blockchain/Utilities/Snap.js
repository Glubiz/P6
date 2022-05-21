const fs = require('fs')

const Snapshot = () => {
    if(fs.existsSync('../Storage/Master.json') && fs.readFileSync('../Storage/Master.json').length > 0){
        var Chain = JSON.parse(fs.readFileSync('../Storage/Master.json'))
        var now = new Date().getTime().toString()
        fs.writeFileSync('../Storage/Snaps/' + now + '.json', JSON.stringify(Chain, null, 4))
    }
}

setInterval(Snapshot, 900 * 1000)

module.exports = Snapshot