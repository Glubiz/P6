const fs = require('fs')
const Path = './middleware/Blockchain/Storage/Master.json'

const TruncatePriceFunctions = () => {
    var Data = {}

    var Chain = JSON.parse(fs.readFileSync(Path))
    Data.Events = Chain.Events
    Data.Providers = Chain.Providers

    return new Promise((resolve) => {
        resolve(Data)
    });
}

module.exports = TruncatePriceFunctions