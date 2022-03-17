const blockchainPath = './middleware/Validator/Blockchain/Validator.json'
const fs = require('fs')
//This file contains all the pages that can be loaded on the website
exports.getIndex = (req, res, next) => {
  // console.log("test")
  if (!res.locals.isAuthenticated){
    res.redirect('/Login')
  } else {
    var chain = JSON.parse(fs.readFileSync(blockchainPath))
    console.log(chain.nodes)
    res.render('main/dashboard', {
      nodes: chain.nodes,
      providers: chain.providers,
      prices: chain.prices,
      pageTitle: 'Index',
      path: '/'
    });
  }
};

exports.getAbout = (req, res, next) => {
    res.render('main/about', {
      pageTitle: 'About',
      path: '/'
    });
};
