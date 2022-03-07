const fs = require('fs')
const Nonce = require('./nonce')
const search = require('./search')
const paths = require('../../util/blockchainPath');
const calcNonce = Nonce.nonce

var arr = []
var success = []

function validate(){
    var chain = JSON.parse(fs.readFileSync(paths.path))
    var nodes = chain.nodes
    var work = search.searchNonce()
    for (var i = 0; i < work.length; i++) {
        nodes[work[i].index].nonce = calcNonce(work[i].hash)
    }
    chain.nodes = nodes
    fs.writeFileSync(paths.path, JSON.stringify(chain, null, 4))
}

function pingCandidates(){
    // Number of nodes that hasn't responded
    var failed = 0
    // Number of reserve reached
    var reserve
    // Pings the first few nodes to see if they are active
    for (var i = 0; i < Math.round((arr.length - 1) * 0.7); i++){
        var index = arr[i]

        var block = search.searchIndex(index)

        require('axios')
        .get('https://' + block.IP + ':' + block.port + '/Ping/')
        .then(response => {
            if(!response){
                if (failed == 0) {
                    Math.round(arr.length * 0.7) + 1
                    failed++
                } else {
                    reserve++
                    failed++
                }
            } else {
                var node = {
                    IP: block.IP,
                    Port: block.port
                }
                success.push(node)
            }
        })
        if (success.length == Math.round((arr.length - 1) * 0.7)){
            validate()
            break
        }
    }
}

function generateValidatorNode(){
    // Generere en data præcis en måned tilbage
    var newDate = new Date().getTime().toString()
    newDate = parseInt(newDate - 2629800000)
    var chain = JSON.parse(fs.readFileSync(paths.path))
    chain = chain.nodes
    chain = chain.filter(block => parseInt(block.timeStamp) >= newDate && !block.blocked)
    var maxIndex = chain.nodes.length
    // If the network of nodes (IoT gateways) is big enough, we want 10% of the network to validate the chain. the nodes that has been in the network the longest weighs the most on the proccess
    // for (var i = 0; i < parseInt(maxIndex * 0.1); i++){
    
    arr = []
    for (var i = 0; i < 5; i++){
        // Finds a random validator node
        var index = Math.floor(Math.random() * parseInt(maxIndex))
        console.log(index)
        if (arr.includes(index)){
            i--
        } else {
            arr.push(index)
        }
    }
    pingCandidates()
}
validate()
// setInterval(generateValidatorNode, 90000)

// module.exports = [arr]