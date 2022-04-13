//Packages
const fs = require('fs');
const SHA256 = require('crypto-js/sha256');

//Models
const Data = require('../models/Data')
const ApiKeys = require('../models/Keys')

//Middleware
const CreateEvent = require('../middleware/Blockchain/CreateBlock/CreateBlock');
const CreateKey = require('../middleware/Blockchain/Utilities/CreateKey');

exports.addNode = (req, res, next) => {
  var IP = req.body.IP
  const AreaCode = "9000"
  var Now = new Date().getTime().toString()
  var chainID = SHA256(IP, AreaCode, Now).toString()
  
  ApiKeys.findOne({
    where: {
        ChainID : chainID
    }
  })
  .then(result => {
      if (result){
          res.status(401).send("Not allowed")
      }

      var Key = SHA256(chainID, "none", "hashthis").toString()
      ApiKeys.create({
          Key : Key,
          ChainID : chainID
      })
      .then(() => {
        CreateEvent(Type = 'Create Node', ID =  chainID, IP = IP, Port = '3033', Area = AreaCode)
        .then(response => {
          res.status(200).send([chainID, Key])
        })
      })
  })
  .catch(err => {
      console.log(err)
      
  })
}

exports.validate = (req, res, next) => {
  var temp = chooseValidator
  console.log(temp)
}

exports.Ping = (req, res, next) => {
  console.log("Pinged")
  res.status(200).send("OK")
}

//Kun til test, skal laves i Python eller Java på gatewayen
exports.sendData = (req, res, next) => {
  res.status(200).send("ckskkdkcskkasa12")
}