const cote = require('cote');
const CollectedValidators = require('../Blockchain/Consensus/CollectedValidators')

const Subscriber = new cote.Subscriber({ name: 'Sub', subscribesTo: ['ValidatorCandidates']})

Subscriber.on('ValidatorCandidates', (Block) => {
    CollectedValidators.CollectedValidators(Block)
})

module.exports = Subscriber