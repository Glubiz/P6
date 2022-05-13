//Packages
const fs = require('fs');
const SHA256 = require('crypto-js/sha256');

//Models
const ApiKeys = require('../models/Keys')
const PendingDB = require('../models/Pending')
const UserDB = require('../models/user')

//Middleware
const CreateEvent = require('../middleware/Blockchain/CreateBlock/CreateBlock');
const Snap = require('../middleware/Blockchain/Utilities/Snap')
const TruncateChain = require('../middleware/Blockchain/Utilities/TruncateChain')


exports.addNode = (req, res, next) => {
  var IP = req.query.IP
  var AreaCode = req.query.AreaCode
  var Now = new Date().getTime().toString()
  var chainID = SHA256(IP + AreaCode + Now).toString()

  var Key = SHA256(chainID, "none", "hashthis").toString()
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
  res.status(200).send({ChainID : chainID, APIKey : Key})
}

exports.Ping = (req, res, next) => {
  var Pings
  var ID = req.query.ID
  var AreaCode = req.query.AreaCode
  var now = new Date().getTime().toString()

  var Blockchain = JSON.parse(fs.readFileSync('./middleware/Blockchain/Storage/Master.json'))
  for(let i = 0; i < Blockchain.Areas.length; i++){
    if(Blockchain.Areas[i].AreaID !== AreaCode){
      continue
    }

    for (let x = 0; x < Blockchain.Areas[i].length; x++){
      if(Blockchain.Areas[i].Nodes[x].NodeID === ID){
        if(!Blockchain.Areas[i].Nodes[x].UpdatedAt || parseInt(Blockchain.Areas[i].Nodes[x].UpdatedAt) < parseInt(now - (3600 * 1000))){
          Blockchain.Areas[i].Nodes[x].Pings++
          Blockchain.Areas[i].Nodes[x].UpdatedAt = now
        }
        Pings = Blockchain.Areas[i].Nodes[x].Pings
        now = Blockchain.Areas[i].Nodes[x].UpdatedAt
        break
      }
    }
  }
  res.status(200).send({Pings : Pings, Now : now})
}

exports.fetchEventHash = (req, res, next) => {
  var ID = req.body.ID
  var APIKey = req.body.APIKey
  var Provider = req.body.Provider
  var Area = req.body.Area
  var Usage = req.body.Usage

  ApiKeys.findOne({where : {Key : APIKey}})
  .then(async result => {
    if (result){
      var Create = CreateEvent('Create Transaction', ID, Provider, Area, Usage)
      res.status(200).send(Create)
    } else {
      res.status(401).send("Not allowed")
    }
  })
  .catch(err => {
      console.log(err)
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