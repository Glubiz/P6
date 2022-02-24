const fs = require('fs');
const Data = require('../models/Data')
const Validator = require('../middleware/Validator')

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