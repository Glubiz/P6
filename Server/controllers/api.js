//Packages
const fs = require('fs');
const SHA256 = require('crypto-js/sha256');

//Models
const Data = require('../models/Data')
const ApiKeys = require('../models/Keys')
const PendingDB = require('../models/Pending')
const UserDB = require('../models/user')

//Middleware
const CreateEvent = require('../middleware/Blockchain/CreateBlock/CreateBlock');
const Snap = require('../middleware/Blockchain/Utilities/Snap')

exports.addNode = (req, res, next) => {
  var IP = req.body.IP
  const AreaCode = "9000"
  var Now = new Date().getTime().toString()
  var chainID = SHA256(IP, AreaCode, Now).toString()

  PendingDB.create({
    UserID : chainID,
    Date : Now,
    Type : 'Node'
  })
  .catch(err => {
      console.log(err)
  })
  res.status(200)
}

exports.Ping = (req, res, next) => {
  var ID = req.body.ID
  var AreaCode = "9000"
  var now = new Date().getTime().toString()

  var Blockchain = fs.readFileSync('./middleware/Blockchain/Storage/Master.json')
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
        break
      }
    }
  }
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