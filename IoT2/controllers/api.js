//Packages
const fs = require('fs');
const SHA256 = require('crypto-js/sha256');

//Middleware
const StartUp = require('../middleware/StartUp')
const Alive = require('../middleware/Alive')
const Usage = require('../middleware/Usage')

//Starts scripts to run in the background
const Transactions = require('../middleware/Blockchain/Transactions/AddTransaction')
const CreateEvent = require('../middleware/Blockchain/CreateBlock/CreateBlock')
const Price = require('../middleware/Blockchain/Utilities/PriceFunctions')
const Providers = require('../middleware/Blockchain/Utilities/Providers')

//MQTT Listeners
const RequestChain = require('../middleware/MQTT/RequestChain')
const AddPendingBlock = require('../middleware/MQTT/AddPendingBlock')
const NewNode = require('../middleware/MQTT/NewNode')
const ValidatedBlock = require('../middleware/MQTT/ValidatedBlock')
const ValidatorCandidates = require('../middleware/MQTT/ValidatorCandidates')


const GenerateValidators = require('../middleware/Blockchain/Consensus/GenerateValidators')
const CollectedValidators = require('../middleware/Blockchain/Consensus/CollectedValidators')

const Validate = require('../middleware/Blockchain/Consensus/Validate')



