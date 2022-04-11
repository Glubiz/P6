const axios = require('axios')
const fs = require('fs')

const Pool = [

]

const Ping = () => {
    //Loads the Chain
    var Blockchain = JSON.parse(fs.readFileSync('./../Storage/Master.json'))
    for(let i = 0; i < Blockchain.Areas.length; i++) {
        Pool[i] = {
            AreaID: Blockchain.Areas[i].AreaID,
            Nodes: []
        }
        for(let j = 0; j < Blockchain.Areas[i].Nodes.length; j++){
            console.log(Blockchain.Areas[i].Nodes[j].IP + ':' + Blockchain.Areas[i].Nodes[j].Port + '/Ping')
            axios
            .get('192.168.87.108:' + Blockchain.Areas[i].Nodes[j].Port + '/Ping')
            .then(response =>{
                console.log(response)
                //If response then update the block containing the node, and adds the response to the Pool array
                // if(response){
                //     let Pings = parseInt(Nodes[i].Ping + 1).toString()

                //     Nodes[i] = {
                //         ...Nodes[i],
                //         Ping : Pings
                //     }

                //     Pool.push(response)
                // }
            })
            console.log(Blockchain.Areas[i].Nodes[j])
        }
    }
    //Singles out the Nodes in the blockchain
    // var Nodes = Blockchain.Nodes

    //Pings each of the Nodes
    // for (let i = 0; i < Nodes.length; i++) {
    //     //Uses axios to call "IP:Port/Ping"
    //     axios
    //     .get('https://' + Nodes[i].IP + ':' + Nodes[i].Port + '/Ping')
    //     .then(response =>{
    //         console.log(response)
    //         //If response then update the block containing the node, and adds the response to the Pool array
    //         if(response){
    //             let Pings = parseInt(Nodes[i].Ping + 1).toString()

    //             Nodes[i] = {
    //                 ...Nodes[i],
    //                 Ping : Pings
    //             }

    //             Pool.push(response)
    //         }
    //     })
    // }

    //Overwrites the previous nodes
    // Blockchain.Nodes = Nodes
    console.log(Pool)
    //Write to file
    // fs.writeFileSync('./Storage/Master.json', JSON.stringify(chain, null, 4))
}

Ping()
//Runs every 15 minutes
// setInterval(Ping, 900000)

//Exports the Pool array
// module.exports = [Pool]