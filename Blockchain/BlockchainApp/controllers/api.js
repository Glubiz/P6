//Packages
const fs = require('fs');
const axios = require('axios')

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
  const apiKey = req.params.apiKey

  if (apiKey === 'api'){
    axios.get(IP + ':4000/addMe')
    .then(data => {
      var chainID = data.chainID 
      createBlock(chainID, IP)
      .then(response => {
        return response
      })
    })
  } else {
    return 500
  }
}