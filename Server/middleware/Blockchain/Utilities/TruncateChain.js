const fs = require('fs')
const Path = './middleware/Blockchain/Storage/Master.json'

const TruncateChain = () => {
    var Data = {}

    var Chain = JSON.parse(fs.readFileSync(Path))

    Data = Chain

    return new Promise((resolve) => {
        resolve(Data)
    });
}

module.exports = TruncateChain