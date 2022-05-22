const fs = require('fs')

const Pings = async (ID, AreaCode) => {
    var Block
    console.log(ID, AreaCode)
    var now = new Date().getTime().toString()

    var Blockchain = JSON.parse(fs.readFileSync('./middleware/Blockchain/Storage/Master.json'))
    for(let i = 0; i < Blockchain.Areas.length; i++){
        if(Blockchain.Areas[i].AreaID == AreaCode){
            for (let x = 0; x < Blockchain.Areas[i].Nodes.length; x++){

                if(Blockchain.Areas[i].Nodes[x].NodeID === ID){
                    console.log(Blockchain.Areas[i].Nodes[x])

                    if(!Blockchain.Areas[i].Nodes[x].PingUpdated || parseInt(Blockchain.Areas[i].Nodes[x].PingUpdated) < parseInt(now - (3600 * 1000))){
                        console.log(Blockchain.Areas[i].Nodes[x].Pings)

                        Blockchain.Areas[i].Nodes[x].Pings++
                        Blockchain.Areas[i].Nodes[x].PingUpdated = now
                        fs.writeFileSync('./middleware/Blockchain/Storage/Master.json', JSON.stringify(Blockchain, null, 4))

                    }
                    
                    Block = Blockchain.Areas[i].Nodes[x]
                    console.log(Block)
                    return new Promise((resolve) => {
                        resolve(Block)
                    });

                }
            }
        }

    }
    await new Promise((resolve => setTimeout(resolve,30000)))
    return new Promise((reject) => {
        reject()
    });
}


module.exports = Pings