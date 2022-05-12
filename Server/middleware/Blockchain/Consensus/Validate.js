const fs = require('fs')
const hash = require('./../Utilities/Hash')
// const nonce = require('./nonce')
const path = '../Storage/Master.json'
// './middleware/Blockchain/Storage/Master.json'

var delay = 60

function validateChain(){
    delay = Math.random() * 1000

    const failed = {}
    // Loads the blockchain into the chain variable
    var Chain = JSON.parse(fs.readFileSync(path))
    
    for(let Event in Chain.Events){
        var Hash = hash(Event.EventHash + Event.Caller, Event.PreviousHash, Event.DateTime)
        if(Hash == Event.Hash){
            continue
        } else {
            failed.Events = Event
            break
        }
    }

    for(let Area in Chain.Areas){
        var Hash = hash(Area.EventHash + Area.AreaID, Area.PreviousHash, Area.DateTime)
        if(Hash == Area.Hash){
            continue
        } else {
            failed.Areas = Area
            break
        }
    }

    for(let Node in Chain.Areas.Nodes){
        var Hash = hash(Node.EventHash + Node.NodeID, Node.PreviousHash, Node.DateTime)
        if(Hash == Node.Hash){
            continue
        } else {
            failed.Nodes = Node
            break
        }
    }

    for(let Transaction in Chain.Areas.Transactions){
        var Hash = hash(Transaction.EventHash + Transaction.NodeID + Transaction.Provider + Transaction.Price, Transaction.PreviousHash, Transaction.DateTime)
        if(Hash == Transaction.Hash){
            continue
        } else {
            failed.Transactions = Transaction
            break
        }
    }

    for(let Provider in Chain.Provider){
        var Hash = hash(Provider.EventHash + Provider.ProviderID, Provider.PreviousHash, Provider.DateTime)
        if(Hash == Provider.Hash){
            continue
        } else {
            failed.Providers = Provider
            break
        }
    }

    for(let Price in Chain.PriceFunctions){
        var Hash = hash(Price.EventHash + Price.ProviderID, Price.PreviousHash, Price.DateTime)
        if(Hash == Price.Hash){
            continue
        } else {
            failed.PriceFunctions = Price
            break
        }
    }

    return new Promise((resolve) => {
        if(failed.length > 0){
            resolve(failed)
        }
        resolve('ok')
    });
}

setInterval(validateChain, delay * 1000)

module.exports = validateChain