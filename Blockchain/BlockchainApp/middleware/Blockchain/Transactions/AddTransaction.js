const fs = require('fs')

const Add = () => {
    var time = new Date()
    time = parseFloat(time.getHours() + '.' + parseInt((time.getMinutes() / 60) * 100))

    //Loading the device keys
    var Self = fs.readFileSync('./middleware/IoT/Keys.json')

    //Loading the Providers
    var Prices = fs.readFileSync('./middleware/Blockchain/Storage/Master.json')
    Prices = Prices.filter(Price => Price.Areas === '*' || Price.Areas === Self.AreaCode)

    var ChosenProvider = {}

    for(let Price of Prices){
        var temp = (((parseInt(Price.Top - Price.Bottom)) / 2) * Math.sin(0.5 * (time - 6.5)) + 50) * Usage

        temp *= 7.5

        if(!ChosenProvider.Provider || ChosenProvider.Price > temp){
            ChosenProvider = {Provider: Price.ProviderID, Price: temp}
        }
    }

    
}

setInterval(Add, 3600 * 1000)