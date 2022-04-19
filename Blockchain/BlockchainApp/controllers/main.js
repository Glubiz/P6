const fs = require('fs')
//This file contains all the pages that can be loaded on the website
exports.getIndex = (req, res, next) => {
  // console.log("test")
  res.render('main/index', {
    pageTitle: 'Home',
    path: '/'
  });
};

exports.getDashboard = (req, res, next) => {
  // console.log("test")
  if (!res.locals.isAuthenticated){
    res.redirect('/Login')
  } else {
    // var chain = JSON.parse(fs.readFileSync('../middleware/Blockchain/Storage/Master.json'))
    // console.log(chain.nodes)
    res.render('main/dashboard', {
      // nodes: chain.nodes,
      // providers: chain.providers,
      // prices: chain.prices,
      pageTitle: 'Dashboard',
      path: '/Dashboard/' +  req.session.userID
    });
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
