const fs = require('fs')

const setPriceFunction = (lower, upper, provider, area) => {
    var Chain = JSON.parse(fs.readFileSync('./middleware/Blockchain/Storage/Master.json'))

    for(let i = 0; i < Chain.PriceFunctions.length; i++){
        if (Chain.PriceFunctions[i].ProviderID === provider && (Chain.PriceFunctions[i].Areas === '*' || Chain.PriceFunctions[i].Areas === area)){
            
        }
    }
}

module.exports = setPriceFunction