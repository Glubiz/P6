const fs = require('fs');

function searchChain(data){
    var chain = JSON.parse(fs.readFileSync('./Blockchain/Validator.json'))
    chain = chain.data
    console.log(chain.data)
    const result = chain.filter(block => block.chainID == data)
    console.log(result);
}

searchChain("sgdsdfe2e2")