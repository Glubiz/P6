const axios = require('axios')
const fs = require('fs')

const Pool = []

const Ping = () => {
    //Loads the Chain
    var Blockchain = JSON.parse(fs.readFileSync('./Storage/Master.json'))

    //Singles out the Nodes in the blockchain
    var Nodes = Blockchain.Nodes

    //Pings each of the Nodes
    for (let i = 0; i < Nodes.length; i++) {
        //Uses axios to call "IP:Port/Ping"
        axios
        .get(Nodes[i].IP + ':' + Nodes[i].Port + '/Ping')
        .then(response =>{
            //If response then update the block containing the node, and adds the response to the Pool array
            if(response){
                let Pings = parseInt(Nodes[i].Ping + 1).toString()

                Nodes[i] = {
                    ...Nodes[i],
                    Ping : Pings
                }

                Pool.push(response)
            }
        })
    }

    //Overwrites the previous nodes
    Blockchain.Nodes = Nodes

    //Write to file
    fs.writeFileSync('./Storage/Master.json', JSON.stringify(chain, null, 4))
}

//Runs every 15 minutes
setInterval(Ping, 900000)

//Exports the Pool array
module.exports = [Pool]