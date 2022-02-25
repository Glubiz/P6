const fs = require('fs');
function search(chainID, data){
    var chain = JSON.parse(fs.readFileSync('./Blockchains/' + chainID + '.json'))
    chain = chain.data
    console.log(chain.data)
    const result = chain.filter(block => block.data == data)
    console.log(result);
}

// search("kfkaksfkas", "gfgjfjghk")