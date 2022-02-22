const fs = require('fs');
function search(chainID, data){
    var chain = JSON.parse(fs.readFileSync('./Blockchains/' + chainID + '.json'))
    chain = chain.data
    console.log(chain)
    const result = chain.filter(chain.data == data)
    console.log(result);
}

search("kfkaksfkas", "Genesis")