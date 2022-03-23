//This file contains all the api calls that the domain can handle
exports.getNumber = (req, res, next) => {
    const Number = 5
    if (Number){
      res.status(200).send(Number)
    } else {
      res.status(201).send("fetching...")
    }
  };