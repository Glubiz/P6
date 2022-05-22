const fs = require('fs')
const hash = require('./../Utilities/Hash')
const CollectedValidators = require('./CollectedValidators')
const Publish = require('../Utilities/SendTransaction')


//Validates the blockchain. It can either work through the stored blockchain or received blockchains
const validateChain = (Chain) => {
    if(Chain == 'Self'){
        console.log('Validating')
        Chain = fs.readFileSync('./middleware/Blockchain/Storage/Master.json')
    }
    Chain = JSON.parse(Chain)

    console.log(Chain)

    //Each module of the function checks the validity of the blockchain
    for(let data in Chain.Events){
        var Hash = hash(data.EventHash + data.Caller, data.PreviousHash, data.DateTime)
        if(Hash == data.Hash){
            continue
        } else {
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
            return new Promise((reject) => {
                reject(data)
            });
        }
    }

    for(let data in Chain.Area[0].Nodes[0]){
        var Hash = hash(data.EventHash + data.NodeID, data.PreviousHash, data.DateTime)
        if(Hash == data.Hash){
            continue
        } else {
            return new Promise((reject) => {
                reject(data)
            });
        }
    }

    for(let data in Chain.Area[0].Transactions[0]){
        var Hash = hash(data.EventHash + data.NodeID + data.Provider + data.Price, data.PreviousHash, data.DateTime)
        if(Hash == data.Hash){
            continue
        } else {
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
            return new Promise((reject) => {
                reject(data)
            });
        }
    }

    return new Promise((resolve) => {
        resolve(Chain)
    });
}

//Activates the validation if the node has been voted as a validator
const runValidation = () => {
    CollectedValidators.CountedValidators()
    .then(List => {
        var Self = JSON.parse(fs.readFileSync('./middleware/Storage/Keys.json'))
        
        if(List.length > 0){

            //Checks if the node is in the top 50% of the blockchain. If it is, then start validating
            for (var i = 0; i < List.length / 2; i++) {
                if(List[i].Node == Self.ChainID){
                    validateChain("Self")
                    .then(Chain => {
                        Chain = JSON.parse(fs.readFileSync('./middleware/Blockchain/Storage/Master.json'))
                        console.log(Chain)
                        //If the validation was successful send the validated chain to the other nodes in the area
                        Publish(JSON.stringify(Chain), 'Validation OK')
                    })
                    .catch(err => {
                        //Roll back mode to come
    
                    })
                }
            }
        }

    })
}

setInterval(runValidation, 60000)

module.exports = {validateChain, runValidation}
// Skal bruges et andet sted
// if (now - parseInt(data.timeStamp) >= 10080 && data.Pings > 100){
//     fs.writeFileSync('./../Storage/Master.json', JSON.stringify(Chain, null, 4))
// }