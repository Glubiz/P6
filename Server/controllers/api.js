//Packages
const fs = require('fs');
const SHA256 = require('crypto-js/sha256');

//Models
const ApiKeys = require('../models/Keys')
const PendingDB = require('../models/Pending')
const UserDB = require('../models/user')

//Middleware
const Validators = require('../middleware/Blockchain/Consensus/SelectValidator')
const CreateBlock = require('../middleware/Blockchain/CreateBlock/CreateBlock')
const Snap = require('../middleware/Blockchain/Utilities/Snap')
const Pings = require('../middleware/Blockchain/Utilities/Pings')
const TruncateChain = require('../middleware/Blockchain/Utilities/TruncateChain')
const TruncatePriceFunctions = require('../middleware/Blockchain/Utilities/TruncatePriceFunctions')
const TruncateProviders = require('../middleware/Blockchain/Utilities/TruncateProviders')


exports.addNode = (req, res, next) => {
  var IP = req.query.IP
  var AreaCode = req.query.AreaCode
  var Now = new Date().getTime().toString()
  var chainID = SHA256(IP + AreaCode + Now).toString()

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
  CreateBlock('Create Node', chainID, AreaCode)
  .then(() => {
    res.status(200).send({ChainID : chainID, APIKey : Key})
  })
}

exports.Ping = (req, res, next) => {
  var ID = req.query.ID
  var AreaCode = req.query.AreaCode
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
  var AreaCode = req.query.AreaCode
  var APIKey = req.query.APIKey
  
  ApiKeys.findOne({where : {Key : APIKey}})
  .then(async result => {
    if (result.length == 0){
      res.status(401).send('Not allowed')
    }

    var Chain = await TruncateChain(AreaCode.toString())
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

exports.fetchPriceFunctions = (req, res, next) => {
  var APIKey = req.query.APIKey
  
  ApiKeys.findOne({where : {Key : APIKey}})
  .then(async result => {
    if (result.length == 0){
      res.status(401).send('Not allowed')
    }

    var PriceFunctions = await TruncatePriceFunctions()
    res.status(200).send(JSON.stringify(PriceFunctions, null, 4))
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