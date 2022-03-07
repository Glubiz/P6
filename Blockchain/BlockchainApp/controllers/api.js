//Packages
const fs = require('fs');

//Models
const Data = require('../models/Data')

//Middleware
const createBlock = require('../middleware/Validator/createBlock');
const chooseValidator = require('../middleware/Validator/chooseValidator');
const validateChain = require('../middleware/Validator/validateChain');

exports.addMe = (req, res, next) => {
  const IP = req.body.IP
  const apiKey = req.body.apikey

  //Skal skiftes
  if (apiKey === 'api'){
    // require('axios')
    // .get('http://' + IP + ':3033/sendData')
    // .then(data => {
      var chainID = 'adsadjj112'
      createBlock.createNode(chainID, IP)
      .then(response => {
        res.status(response).send("OK")
      })
    // })
  } else {
    res.status(500)
  }
}

exports.validate = (req, res, next) => {
  var temp = chooseValidator
  console.log(temp)
}

//Kun til test, skal laves i Python eller Java på gatewayen
exports.sendData = (req, res, next) => {
  res.status(200).send("ckskkdkcskkasa12")
}