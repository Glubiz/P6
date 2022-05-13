//NPM Modules
const fs = require('fs')
const axios = require('axios')

//Middleware
const Broadcast = require('./../Utilities/SendTransaction')

//Constants
const URL = '/fetchEventHash'


const Add = () => {
    var time = new Date()
    time = parseFloat(time.getHours() + '.' + parseInt((time.getMinutes() / 60) * 100))

    //Loading the device keys
    var Self = fs.readFileSync('./middleware/Storage/Keys.json')

    //Loading the household usage
    var Usage = fs.readFileSync('./middleware/Storage/Usage.json')
    Usage.length > 96 ? Usage = Usage.filter(Usage => Usage.Date >= parseInt((new Date().getTime().toString() / 1000) - 86400)) : Usage
    Usage = Usage[Usage.length - 1]

    //Loading the Providers
    var Prices = fs.readFileSync('./middleware/Blockchain/Storage/Master.json')
    Prices = Prices.filter(Price => Price.Areas === '*' || Price.Areas === Self.AreaCode)

    var ChosenProvider = {}

    for(let Price of Prices){
        var temp = (((parseInt(Price.Top - Price.Bottom)) / 2) * Math.sin(0.5 * (time - 6.5)) + 50) * Usage.Usage

        temp *= 7.5

        if(!ChosenProvider.Provider || ChosenProvider.Price > temp){
            ChosenProvider = {Provider: Price.ProviderID, Price: temp}
        }
    }

    axios
    .post(URL, {
        ID : Self.ChainID,
        APIKey : Self.APIKey,
        Provider : ChosenProvider.Provider,
        Area : '9000', 
        Usage : Usage.Usage
    })
    .then(response => {
        Broadcast(response.data, 'Transaction', Self.AreaCode)
    })
    .catch(err => {
        console.error(err)
    })
}

setInterval(Add, 3600 * 1000)

module.exports = Add