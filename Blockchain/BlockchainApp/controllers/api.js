//Packages
const fs = require('fs');

//Models
const Data = require('../models/Data')

//Middleware
const createBlock = require('../middleware/Validator/createBlock');

//This file contains all the api calls that the domain can handle
exports.getNumber = (req, res, next) => {
    const Number = 5
    if (Number){
      res.status(200).send(Number)
    } else {
      res.status(201).send("fetching...")
    }
  };

exports.postData = (req, res, next) => {
  console.log(req.body)
  const Data = req.body.Data
  fs.writeFileSync('Chains/blockchain.json', Data)

  res.status(200).send("OK")
};

exports.getData = (req, res, next) => {
  temp = []
  Data.findAll(
    {
      order: [
        ['createdAt', 'DESC']
      ], 
      limit: 2
    }
  )
  .then(results => {
    for (let result of results){
      temp.push(result.Data)
    }
  })
  .then(() => {
    res.status(200).send(temp)
  })
};

exports.postData = (req, res, next) => {
  console.log(req.body)
  const Data = req.body.Data
  fs.writeFileSync('Chains/blockchain.json', Data)

  res.status(200).send("OK")
};

exports.addMe = (req, res, next) => {
  const IP = req.body.IP
  const apiKey = req.body.apikey

  //Skal skiftes
  if (apiKey === 'api'){
    require('axios')
    .get('http://' + IP + ':3033/sendData')
    .then(data => {
      var chainID = data.nodes 
      createBlock(chainID, IP)
      .then(response => {
        res.status(response).send("OK")
      })
    })
  } else {
    res.status(500)
  }
}

//Kun til test, skal laves i Python eller Java på gatewayen
exports.sendData = (req, res, next) => {
  res.status(200).send("ckskkdkcskkasa12")
}