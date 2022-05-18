const fs = require('fs')
const hash = require('./../Utilities/Hash')

module.exports = function validateChain(Chain = 0){
    // Loads the blockchain into the chain variable
    if(Chain === 0){
        Chain = JSON.parse(fs.readFileSync('./middleware/Blockchain/Storage/Master.json'))
    } else {
        Chain = JSON.parse(Chain)
    }
    
    for(let data in Chain.Events){
        var Hash = hash(data.EventHash + data.Caller, data.PreviousHash, data.DateTime)
        if(Hash == data.Hash){
            continue
        } else {
            //Skal indhente ledger fra noder til at validere chainen.
            return new Promise((reject) => {
                reject(data)
            });
        }
    }

    for(let data in Chain.Area){
        var Hash = hash(data.EventHash + data.AreaID, data.PreviousHash, data.DateTime)
        if(Hash == data.Hash){
            continue
        } else {
            //Skal indhente ledger fra noder til at validere chainen.
            return new Promise((reject) => {
                reject(data)
            });
        }
    }

    for(let data in Chain.Area.Nodes[0]){
        var Hash = hash(data.EventHash + data.NodeID, data.PreviousHash, data.DateTime)
        if(Hash == data.Hash){
            continue
        } else {
            //Skal indhente ledger fra noder til at validere chainen.
            return new Promise((reject) => {
                reject(data)
            });
        }
    }

    for(let data in Chain.Area.Transactions[0]){
        var Hash = hash(data.EventHash + data.NodeID + data.Provider + data.Price, data.PreviousHash, data.DateTime)
        if(Hash == data.Hash){
            continue
        } else {
            //Skal indhente ledger fra noder til at validere chainen.
            return new Promise((reject) => {
                reject(data)
            });
        }
    }

    for(let data in Chain.Provider){
        var Hash = hash(data.EventHash + data.ProviderID, data.PreviousHash, data.DateTime)
        if(Hash == data.Hash){
            continue
        } else {
            //Skal indhente ledger fra noder til at validere chainen.
            return new Promise((reject) => {
                reject(data)
            });
        }
    }

    for(let data in Chain.PriceFunctions){
        var Hash = hash(data.EventHash + data.ProviderID, data.PreviousHash, data.DateTime)
        if(Hash == data.Hash){
            continue
        } else {
            //Skal indhente ledger fra noder til at validere chainen.
            return new Promise((reject) => {
                reject(data)
            });
        }
    }

    return new Promise((resolve) => {
        resolve()
    });
}