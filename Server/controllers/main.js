const fs = require('fs')
const UserDB = require('../models/user')
const PendingDB = require('../models/Pending')
const setPriceFunction = require('../middleware/Blockchain/Utilities/setPriceFunction')
const CreateBlock = require('../middleware/Blockchain/CreateBlock/CreateBlock')


//This file contains all the pages that can be loaded on the website
exports.getIndex = (req, res, next) => {
  // console.log("test")
  res.render('main/index', {
    pageTitle: 'Home',
    path: '/'
  });
};

exports.getCreateArea = (req, res, next) => {
  // console.log("test")
  res.render('main/createarea', {
    pageTitle: 'Create Area',
    path: '/CreateArea'
  });
};

exports.postCreateArea = (req, res, next) => {
  console.log(req)
  var Lower = req.body.Lower
  var Upper = req.body.Upper
  var Pending = JSON.parse(fs.readFileSync('./middleware/Blockchain/Storage/Pending.json'))
  var temp = {
      Type : 'Create Price Function',
      ID : 'Server',
      TimeStamp : new Date().getTime().toString(),
      Top: Upper,
      Bottom: Lower
  }
  Pending.push(temp)
  fs.writeFileSync('./middleware/Blockchain/Storage/Pending.json', JSON.stringify(Pending, null, 4))
  res.redirect('/User')
};

exports.getDashboard = (req, res, next) => {
  // console.log("test")
  if (!res.locals.isAuthenticated){
    res.redirect('/Login')
  } else {
    res.redirect('/User')
  }
};

exports.getDev = (req, res, next) => {
  res.render('main/dev', {
    pageTitle: 'Development',
    path: '/Dev'
  });
};

exports.getAbout = (req, res, next) => {
    res.render('main/about', {
      pageTitle: 'About',
      path: '/'
    });
};

exports.getAdmin = (req, res, next) => {
  if(res.locals.Type === 'Admin'){
    var Providers
    var Users
    UserDB.findAll({
      where: {
        Type : "Customer"
      }
    })
    .then(result => {
      Users = result.length
    })
    UserDB.findAll({
      where: {
        Type : "Provider"
      }
    })
    .then(result => {
      Providers = result.length
    })
    PendingDB.findAll()
    .then(result => {
      res.render('main/admin', {
        pageTitle: 'Admin',
        path: '/Admin',
        Users: Users,
        Providers: Providers,
        Pending: result,
      });
    })
  } else {
    res.render('main/index', {
      pageTitle: 'Home',
      path: '/'
    });
  }
};

exports.setPriceFunction = (req, res, next) => {
  if(res.locals.Type === 'Provider'){
    var lower = req.body.lower
    var upper = req.body.upper
    var user = req.body.user

    var area = req.body.area
  }
};