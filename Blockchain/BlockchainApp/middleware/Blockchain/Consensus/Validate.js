const fs = require('fs')
const hash = require('./../Utilities/Hash')
// const nonce = require('./nonce')
const paths = require('../../util/blockchainPath');

module.exports = function validateChain(){
    var now = new Date().getTime().toString()
    // Loads the blockchain into the chain variable
    var Chain = JSON.parse(fs.readFileSync('./middleware/Blockchain/Storage/Master.json'))
    
    for(let Event in Chain.Events){
        var Hash = Hash(Event.EventHash + Event.Caller, Event.PreviousHash, Event.DateTime)
        if(Hash == data.Hash){
            continue
        } else {
            //Skal indhente ledger fra noder til at validere chainen.
            return new Promise((reject) => {
                reject(Event)
            });
        }
    }

    for(let Area in Chain.Areas){
        var Hash = Hash(Area.EventHash + Area.AreaID, Area.PreviousHash, Area.DateTime)
        if(Hash == data.Hash){
            continue
        } else {
            //Skal indhente ledger fra noder til at validere chainen.
            return new Promise((reject) => {
                reject(Area)
            });
        }
    }

    for(let Node in Chain.Areas.Nodes[0]){
        var Hash = Hash(Node.EventHash + Node.NodeID, Node.PreviousHash, Node.DateTime)
        if(Hash == data.Hash){
            continue
        } else {
            //Skal indhente ledger fra noder til at validere chainen.
            return new Promise((reject) => {
                reject(Node)
            });
        }
    }

    for(let Transaction in Chain.Areas.Transactions[0]){
        var Hash = Hash(Transaction.EventHash + Transaction.NodeID + Transaction.Provider + Transaction.Price, Transaction.PreviousHash, Transaction.DateTime)
        if(Hash == data.Hash){
            continue
        } else {
            //Skal indhente ledger fra noder til at validere chainen.
            return new Promise((reject) => {
                reject(Transaction)
            });
        }
    }

    for(let Provider in Chain.Provider){
        var Hash = Hash(Provider.EventHash + Provider.ProviderID, Provider.PreviousHash, Provider.DateTime)
        if(Hash == data.Hash){
            continue
        } else {
            //Skal indhente ledger fra noder til at validere chainen.
            return new Promise((reject) => {
                reject(Provider)
            });
        }
    }

    for(let Price in Chain.Price){
        var Hash = Hash(Price.EventHash + Price.ProviderID, Price.PreviousHash, Price.DateTime)
        if(Hash == data.Hash){
            continue
        } else {
            //Skal indhente ledger fra noder til at validere chainen.
            return new Promise((reject) => {
                reject(Price)
            });
        }
    }

    return new Promise((resolve) => {
        resolve()
    });
}

// Skal bruges et andet sted
// if (now - parseInt(data.timeStamp) >= 10080 && data.Pings > 100){
//     fs.writeFileSync('./../Storage/Master.json', JSON.stringify(Chain, null, 4))
// }