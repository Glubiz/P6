//This file contains all the pages that can be loaded on the website
exports.getIndex = (req, res, next) => {
    res.render('main/index', {
      pageTitle: 'Index',
      path: '/'
    });
};
