const bcrypt = require('bcryptjs');
const { Op } = require("sequelize");
const UserDB = require('../models/user')

//OK
exports.getLogin = (req, res, next) => {
    res.render('main/login', {
        errorMessage: req.flash('error'),
        successMessage: req.flash('success'),
        pageTitle: 'Login',
        path: '/Login'
    });
};

// NOT OK (Skal måske fjernes)
exports.getUser = (req, res, next) => {
    const UserID = req.session.userID
    res.render('main/dashboard', {
        errorMessage: req.flash('error'),
        pageTitle: 'User',
        path: '/User'
    });
};

// OK 
exports.getSignup = (req, res, next) => {
    res.render('main/signup', {
        pageTitle: 'Signup',
        path: '/Signup',
        errorMessage: req.flash('error')
    });
};

// OK 
exports.getReset = (req, res, next) => {
    res.render('main/reset', {
        errorMessage: req.flash('error'),
        successMessage: req.flash('success'),
        pageTitle: 'Reset',
        path: '/Reset'
    });
};

// OK
exports.postLogin = (req, res, next) => {
    const Email = req.body.Email;
    const Password = req.body.Password;

    UserDB.findOne({where: {Email : Email}})
    .then(user => {
        if (!user){
            req.flash('error', 'Invalid Email or Password');
            return res.redirect('/Login');  
        }
        bcrypt.compare(Password, user.Password)
            .then(doMatch => {
                if (doMatch){
                    req.session.isLoggedIn = true;
                    req.session.Email = Email
                    req.session.userID = user.id
                    req.flash('success', 'Success');
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

// OK
exports.postSignup = (req, res, next) => {
    const Email = req.body.Email;
    const Password = req.body.Password;
    const RepeatPassword = req.body.RPassword;

    if(Password != RepeatPassword && validateEmail(Email)){
        req.flash('error', 'Passwords does not match');
        return res.redirect('/Signup'); 
    }
    if(validateEmail(Email)){
        req.flash('error', 'Invalid Email');
        return res.redirect('/Signup'); 
    }
    UserDB.findOne({where: {Email: Email}})
    .then(userDoc => {
        if (userDoc){
            req.flash('error', 'User already exists');
            res.redirect('/Signup');
        } else {
            bcrypt.hash(Password, 12)
            .then(hashedPassword => {
                UserDB.create({
                    Email : Email,
                    Password : hashedPassword
                });
            })
            .then(() => {
                req.flash('success', 'Success');
                res.redirect('/Login');
            })
        }
    })
    .catch(err => {
        console.log(err)
    });
};

// NOT OK (Skal ændres til request reset)
exports.postReset = (req, res, next) => {
    const Email = req.body.Email;
    const Password = req.body.Password;
    const RepeatPassword = req.body.RPassword;

    if(Password != RepeatPassword){
        req.flash('error', 'Passwords does not match');
        return res.redirect('/Signup'); 
    }
    UserDB.findOne({where: {Email: Email}})
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
                        Email: Email
                    }
                });
            })
            .then(() => {
                req.flash('success', 'Success');
                res.redirect('/Login');
            })
        }
    })
    .catch(err => {
        console.log(err)
    });
};

// OK
exports.postDeleteUser = (req, res, next) => {
    const Email = res.locals.Email
    UserDB.destroy({
        where: 
        {
            Email: Email
        }
    })
    .then(() => {
        req.session.destroy();
        return res.redirect('/'); 
    })
};
// OK
exports.getLogout = (req, res, next) => {
    req.session.destroy();
    return res.redirect('/');
};

// OK
exports.postChangePassword = (req, res, next) => {
    const RepeatPassword = req.body.RPassword
    const Password = req.body.Password
    const Email = res.locals.Email
    if(Password != RepeatPassword){
        req.flash('error', 'Passwords does not match')
        return res.redirect('/Signup')
    }
    UserDB.findOne({where: {Email: Email}})
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
                        Email: Email
                    }
                });
            })
            .then(() => {
                req.flash('error', 'Password Changed');
                return res.redirect('/Login');
            })
        }
    })
    .catch(err => console.log(err));
};

function validateEmail(){
    if(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(myForm.emailAddr.value)){
        return true 
    } else {
        return false
    }
}