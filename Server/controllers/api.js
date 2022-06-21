//Packages
const fs = require('fs');
const SHA256 = require('crypto-js/sha256');

//Models
const ApiKeys = require('../models/Keys')
const PendingDB = require('../models/Pending')
const UserDB = require('../models/user')

//Middleware
const CreateBlock = require('../middleware/Blockchain/CreateBlock/CreateBlock')
const Link = require('../middleware/Blockchain/Utilities/LinkProviderToDB')

const Snap = require('../middleware/Blockchain/Utilities/Snap')
const Pings = require('../middleware/Blockchain/Utilities/Pings')
const TruncateChain = require('../middleware/Blockchain/Utilities/TruncateChain')
const TruncatePriceFunctions = require('../middleware/Blockchain/Utilities/TruncatePriceFunctions')
const TruncateProviders = require('../middleware/Blockchain/Utilities/TruncateProviders')


exports.addNode = (req, res, next) => {
  var Now = new Date().getTime().toString()
  var chainID = req.query.ID

  var Key = SHA256(chainID + "none" + "hashthis").toString()
  ApiKeys.create({
      Key : Key,
      HashID : chainID
  })
  PendingDB.create({
    UserID : chainID,
    Date : Now,
    Type : 'Node'
  })
  .catch(err => {
      console.log(err)
  })
  CreateBlock('Create Node', chainID)
  .then(() => {
    res.status(200).send({APIKey : Key})
  })
}

exports.Ping = (req, res, next) => {
  var ID = req.query.ID
  var AreaCode = req.query.AreaCode
  console.log(ID, AreaCode)
  Pings(ID, AreaCode)
  .then(Block => {
    res.status(200).send(Block)
  })
  .catch(err => {
    res.status(500).send(err)

  })
}

exports.fetchEventHash = (req, res, next) => {
  var ID = req.query.ID
  var APIKey = req.query.APIKey
  var Provider = req.query.Provider
  var Area = req.query.Area
  var Usage = req.query.Usage

  ApiKeys.findOne({where : {Key : APIKey}})
  .then(async result => {
    if (result){
      CreateBlock('Create Transaction', ID, Provider, Area, Usage)
      .then(Create => {
        console.log(Create)
        res.status(200).send(Create)
      })
    } else {
      res.status(401).send("Not allowed")
    }
  })
  .catch(err => {
    res.status(500).send(err)
  })
}

exports.fetchTruncatedChain = (req, res, next) => {
  var APIKey = req.query.APIKey
  
  ApiKeys.findOne({where : {Key : APIKey}})
  .then(async result => {
    if (result.length == 0){
      res.status(401).send('Not allowed')
    }

    var Chain = await TruncateChain()
    res.status(200).send(JSON.stringify(Chain, null, 4))
  })
}

exports.fetchValidatorList = (req, res, next) => {
  var AreaCode = req.query.AreaCode
  var APIKey = req.query.APIKey
  
  ApiKeys.findOne({where : {Key : APIKey}})
  .then(async result => {
    if (result.length == 0){
      res.status(401).send('Not allowed')
    }

    for(let i = 0; i < Validators.length; i++){
      if(Validators[i].Area == AreaCode){
        res.status(200).send(Validators[i])
      }
    }
  })
}

exports.fetchData = (req, res, next) => {
  var Pending = {}
  var temp = {}
  var APIKey = req.query.APIKey
  
  ApiKeys.findOne({where : {Key : APIKey}})
  .then(async result => {
    if (result.length == 0){
      res.status(401).send('Not allowed')
    }
    console.log(fs.existsSync('./middleware/Blockchain/Storage/Pending.json'))
    if(fs.existsSync('./middleware/Blockchain/Storage/Pending.json')){
      Pending = JSON.parse(fs.readFileSync('./middleware/Blockchain/Storage/Pending.json'))
      console.log(Pending)
      temp = Pending[0]
      Pending = Pending.slice(1)
      fs.writeFileSync('./middleware/Blockchain/Storage/Pending.json', JSON.stringify(Pending, null, 4))
      res.status(200).send(JSON.stringify(temp, null, 4))
    } else {
      res.status(200).send(JSON.stringify({}, null, 4))
    }
  })
}

exports.fetchProviders = (req, res, next) => {
  var APIKey = req.query.APIKey
  
  ApiKeys.findOne({where : {Key : APIKey}})
  .then(async result => {
    if (result.length == 0){
      res.status(401).send('Not allowed')
    }

    var Providers = await TruncateProviders()
    res.status(200).send(JSON.stringify(Providers, null, 4))
  })
}

exports.LogBlockchain = (req, res, next) => {
  console.log('I have been run-_____________________________________')

  var LoggedChain
  var APIKey = req.query.APIKey
  var Chain = JSON.parse(req.query.Blockchain)
  ApiKeys.findOne({where : {Key : APIKey}})
  .then(async result => {
    if (result.length == 0){
      console.log('Invalid API Key')

      res.status(401).send('Not allowed')
    }
    if(fs.existsSync('./middleware/Blockchain/Storage/Master.json')){
      console.log('File exists')
      console.log(fs.readFileSync('./middleware/Blockchain/Storage/Master.json').length > 0)

      if(fs.readFileSync('./middleware/Blockchain/Storage/Master.json').length > 0){
        console.log('File contains data')

        LoggedChain = JSON.parse(fs.readFileSync('./middleware/Blockchain/Storage/Master.json'))
        if(Chain.Events.length > LoggedChain.Events.length){
          if(JSON.stringify(Chain.Events.slice(0, LoggedChain.Events.length)) !== JSON.stringify(LoggedChain.Events)){
            console.log('Events issue')
            res.status(401).send('Corrupt chain')
          }
        }
        if(Chain.Providers.length > LoggedChain.Providers.length){
          if(JSON.stringify(Chain.Providers.slice(0, LoggedChain.Providers.length)) !== JSON.stringify(LoggedChain.Providers)){
            console.log('Providers issue')
            
            res.status(401).send('Corrupt chain')
          }
        }
        if(Chain.PriceFunctions.length > LoggedChain.PriceFunctions.length){
          if(JSON.stringify(Chain.PriceFunctions.slice(0, LoggedChain.PriceFunctions.length)) !== JSON.stringify(LoggedChain.PriceFunctions)){
            console.log('PriceFunctions issue')

            res.status(401).send('Corrupt chain')
          }
        }
        if(Chain.Nodes.length > LoggedChain.Nodes.length){
          if(JSON.stringify(Chain.Nodes.slice(0, LoggedChain.Nodes.length)) !== JSON.stringify(LoggedChain.Nodes)){
            console.log('Nodes issue')

            res.status(401).send('Corrupt chain')
          }
        }
        if (Chain.Transactions.length > LoggedChain.Transactions.length){
          if(JSON.stringify(Chain.Transactions.slice(0, LoggedChain.Transactions.length)) !== JSON.stringify(LoggedChain.Transactions)){
            console.log('Transaction issue')

            res.status(401).send('Corrupt chain')
          }
        }
        console.log('Blockchain Saved')
        fs.writeFileSync('./middleware/Blockchain/Storage/Master.json', JSON.stringify(Chain, null, 4))
        res.status(200).send('Chain logged')
      } else {
        console.log('No Prior - Blockchain Saved')
        fs.writeFileSync('./middleware/Blockchain/Storage/Master.json', JSON.stringify(Chain, null, 4))
        res.status(200).send('Chain logged')
      }
    }
  })
}