const fs = require('fs')
const axios = require('axios')

const Server = '../../../util/'
const path = '../Storage/Master.json'

const CorrectChain = (arr) => {
    var Chain = JSON.parse(fs.readFileSync(path))
    if (arr.Events.length > 0){
        var i = 0

        for (let Event in arr.Events){
            if(Event.Hash === Chain.Events[i]){
                axios
                .get('URL/getblock/index=' + i)
                .then(result => {

                })
                //request block
                break
            }
            i++
        }
    }

    if (arr.Areas.length > 0){
        
    }

    if (arr.Nodes.length > 0){
        
    }

    if (arr.Transactions.length > 0){
        
    }

    if (arr.Providers.length > 0){
        
    }

    if (arr.PriceFunctions.length > 0){
        
    }
}

module.exports = CorrectChain