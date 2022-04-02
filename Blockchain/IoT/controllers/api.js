const {Data} = require('./../middleware/dataSampling')

//This file contains all the api calls that the domain can handle
exports.get = (req, res, next) => {
  res.status(200).send(Data)
};