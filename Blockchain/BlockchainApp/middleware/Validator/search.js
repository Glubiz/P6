const fs = require('fs');
const paths = require('../../util/blockchainPath');

function searchIndex(data){
    var chain = JSON.parse(fs.readFileSync(paths.path))
    chain = chain.nodes
    const result = chain.filter(block => block.index == data)
    return result
    // console.log(result);
}

function searchNonce(){
    var chain = JSON.parse(fs.readFileSync(paths.path))
    chain = chain.nodes
    const result = chain.filter(block => block.nonce == 0)
    return result
    // console.log(result);
}

module.exports = {searchIndex, searchNonce}
// searchChain("sgdsdfe2e2")