const fs = require('fs')
const Path = './middleware/Blockchain/Storage/Master.json'

const TruncateChain = (Area) => {
    var Data = {}

    var Chain = JSON.parse(fs.readFileSync(Path))

    Data.Events = Chain.Events

    var AreaData
    for(var i = 0; i < Chain.Areas.length; i++){
        if(Chain.Areas[i].AreaID != Area){
            continue
        }

        AreaData = [Chain.Areas[i]]
    }

    Data.Area = AreaData

    var Prices = Chain.PriceFunctions.filter(e => e.Areas === '*' || e.Areas === Area)

    Data.PriceFunctions = Prices

    return new Promise((resolve) => {
        resolve(Data)
    });
}

module.exports = TruncateChain