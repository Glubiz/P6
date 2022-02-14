const bcrypt = require('bcryptjs');
const { Op } = require("sequelize");
const UserDB = require('../models/user')

exports.getLogin = (req, res, next) => {
    res.render('main/login', {
        errorMessage: req.flash('error'),
        pageTitle: 'Login',
        path: '/Login'
    });
};

exports.getUser = (req, res, next) => {
    const UserID = req.session.userID
    res.render('main/user', {
        errorMessage: req.flash('error'),
        pageTitle: 'User',
        WalletIDs: WalletIDs,
        price: Data.Price,
        supply: parseFloat(Data.Supply / 1000000000).toFixed(3),
        path: '/User'
    });
};

exports.getSignup = (req, res, next) => {
    res.render('main/signup', {
        pageTitle: 'Signup',
        path: '/Signup',
        errorMessage: req.flash('error')
    });
};

exports.getReset = (req, res, next) => {
    res.render('main/reset', {
        errorMessage: req.flash('error'),
        pageTitle: 'Reset',
        path: '/Reset'
    });
};

//Done
exports.postLogin = (req, res, next) => {
    const Username = req.body.Username;
    const Password = req.body.Password;

    UserDB.findOne({where: {Username : Username}})
    .then(user => {
        if (!user){
            req.flash('error', 'Invalid Username or Password.');
            return res.redirect('/Login');  
        }
        console.log("Test")
        bcrypt.compare(Password, user.Password)
            .then(doMatch => {
                if (doMatch){
                    req.session.isLoggedIn = true;
                    req.session.userName = Username
                    req.session.userID = user.id
                    return res.redirect('/User');
                }
            })
            .catch(err => {
                console.log(err);
                res.redirect('/Login'); 
            });
    })
    .catch(err => console.log(err));
};

exports.postSignup = (req, res, next) => {
    const Username = req.body.Username;
    const Password = req.body.Password;
    const RepeatPassword = req.body.RPassword;
    const Phrase = req.body.Phrase;

    if(Password != RepeatPassword || !Phrase){
        req.flash('error', 'Invalid Password or Secret.');
        return res.redirect('/Signup'); 
    }
    UserDB.findOne({where: {Username: Username}})
        .then(userDoc => {
            if (userDoc){
                req.flash('error', 'User exists');
                res.redirect('/Signup');
            } else {
                bcrypt.hash(Password, 12)
                .then(hashedPassword => {
                    bcrypt.hash(Phrase, 12)
                    .then(hashedPhrase => {
                        UserDB.create({
                            Username : Username,
                            Phrase : hashedPhrase,
                            Password : hashedPassword
                        });
                    })
                })
                .then(result => {
                    res.redirect('/');
                })
            }
        })
        .catch(err => {
            console.log(err)
        });
};

exports.postReset = (req, res, next) => {
    const Username = req.body.Username;
    const Password = req.body.Password;
    const RepeatPassword = req.body.RPassword;
    const Phrase = req.body.Phrase;

    if(Password != RepeatPassword || !Phrase){
        req.flash('error', 'Invalid Password or Secret.');
        return res.redirect('/Signup'); 
    }
    UserDB.findOne({where: {Username: Username}})
        .then(userDoc => {
            if (!userDoc){
                req.flash('error', 'User does not exist');
                res.redirect('/Reset');
            } else {
                bcrypt.hash(Password, 12)
                .then(hashedPassword => {
                    UserDB.update({
                        Password : hashedPassword
                        }, {
                            where: {
                            Username: Username
                        }
                    });
                })
                .then(result => {
                    res.redirect('/');
                })
            }
        })
        .catch(err => {
            console.log(err)
        });
};

exports.postDeleteUser = (req, res, next) => {
    const Username = res.locals.userName
    UserDB.destroy({
        where: 
        {
            Username: Username
        }
    })
    .then(() => {
        req.session.destroy();
        return res.redirect('/'); 
    })
};

exports.getLogout = (req, res, next) => {
    req.session.destroy();
    return res.redirect('/');
};

exports.postChangePassword = (req, res, next) => {
    const Password = req.body.Password;
    const Username = res.locals.userName
    
    bcrypt.hash(Password, 12)
    .then(hashedPassword => {
        UserDB.update({
            Password: hashedPassword
        }, {
            where: {
                Username: Username
            }
        })
    })
    .then(() => {
        req.flash('error', 'Password Changed');
        return res.redirect('/User');
    })
    .catch(err => console.log(err));
};

