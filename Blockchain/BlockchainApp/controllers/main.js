//This file contains all the pages that can be loaded on the website
exports.getIndex = (req, res, next) => {
  if (!res.locals.isAuthenticated){
    res.redirect('/Login')
  } else {
    res.render('main/dashboard', {
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
