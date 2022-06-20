//NPM Modules
const fs = require('fs')
const axios = require('axios')

//Middleware
const Broadcast = require('../Utilities/SendTransaction')

//Constants
const Server = require('../../../util/server')
const URL = Server + 'fetchEventHash'

const Add = () => {
    if(fs.existsSync('./middleware/Blockchain/Storage/Master.json') && fs.existsSync('./middleware/Storage/Usage.json')){

        //Gets the time as a decimal
        var time = new Date()
        time = parseFloat(time.getHours() + '.' + parseInt((time.getMinutes() / 60) * 100))
    
        //Loading the device keys
        var Self = JSON.parse(fs.readFileSync('./middleware/Storage/Keys.json'))
        
        //Loading the household usage and finds the most recent from either 24 hours ago, or the most recent en general
        var Usage = JSON.parse(fs.readFileSync('./middleware/Storage/Usage.json'))
        Usage.length > 96 ? Usage = Usage.filter(Usage => Usage.Date >= parseInt((new Date().getTime().toString() / 1000) - 86400)) : Usage
        Usage = Usage[Usage.length - 1]
    
        //Loading options to choose from
        var Prices = JSON.parse(fs.readFileSync('./middleware/Blockchain/Storage/Master.json'))
        Prices = Prices.PriceFunctions.filter(Price => Price.Areas === '*' || Price.Areas === Self.AreaCode)
        
        //If the price is lower than the last one, save the provider.
        if (Prices.length > 0){
            var ChosenProvider = {}
        
            for(let Price of Prices){
                var temp = (((parseInt(Price.Top - Price.Bottom)) / 2) * Math.sin(0.5 * (time - 6.5)) + 50) * Usage.Usage
        
                temp *= 7.5
        
                if(!ChosenProvider.Provider || ChosenProvider.Price > temp){
                    ChosenProvider = {Provider: Price.ProviderID, Price: parseFloat(temp).toFixed(2)}
                }
            }
        
            //Inform the cloud
            axios({
                method: 'post',
                url: URL,
                params: {
                    ID : Self.ChainID,
                    APIKey : Self.APIKey,
                    Provider : ChosenProvider.Provider,
                    Area : '9000', 
                    Usage : Usage.Usage
                },
            })
            .then(async response => {
                console.log(response.data)
                
                //Send the block to the other nodes in the area
                Broadcast(JSON.stringify(response.data), 'Transaction')
            })
            .catch(err => {
                console.error(err)
            })
        }
    }
}

setInterval(Add, 3600 * 1000)

module.exports = Add