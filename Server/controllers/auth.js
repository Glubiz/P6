const bcrypt = require('bcryptjs');
const { Op } = require("sequelize");
const SHA256 = require('crypto-js/sha256');
const fs = require('fs');

//Models
const UserDB = require('../models/user')
const PendingDB = require('../models/Pending')
const ApiKeys = require('../models/Keys')

//Functions
const CreateBlock = require('../middleware/Blockchain/CreateBlock/CreateBlock')


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
exports.getUser = async (req, res, next) => {
    const Email = req.session.Email
    const Data = []
    var now = new Date().getTime().toString()
    var Chain = JSON.parse(fs.readFileSync('./middleware/Blockchain/Storage/Master.json'))
    if(req.session.Type === 'Provider'){
        UserDB.findOne(
            {
                where : {
                    Email : Email
                }
            }
            )
            .then(result => {
            var Areas = Chain.Providers.filter(e => e.ProviderID === result.HashID)
            Areas = Areas[0].Areas
            Data.push(Areas)

            var Customers = []
            for (let i = 0; i < Chain.Areas.length; i++){
                var temp = Chain.Areas[i].Transactions.filter(e => e.ProviderID === result.HashID && parseInt(e.DateTime) >= parseInt(now - (3600 * 1000)))
                Customers.push(temp)
            }
            // Customers = Customers.length
            Data.push(Customers)
        })
    }
    req.session.Type === 'Provider' && await new Promise((resolve => setTimeout(resolve,5000)))

    res.render('main/dashboard', {
        errorMessage: req.flash('error'),
        pageTitle: 'User',
        path: '/User',
        data: Data
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
    var ApiKey = ""

    UserDB.findOne({where: {Email : Email}})
    .then(user => {
        if (!user){
            req.flash('error', 'Invalid Email or Password');
            return res.redirect('/Login');  
        }

        bcrypt.compare(Password, user.Password)
        .then(doMatch => {
            if (doMatch){
                user.Type === 'Provider' && ApiKeys.findOne({where : {HashID : user.HashID}}).then(result => {if(result){ApiKey = result.Key}})
                req.session.isLoggedIn = true;
                req.session.Email = Email
                req.session.userID = user.id
                req.session.Type = user.Type
                req.session.ApiKey = ApiKey
                req.flash('success', 'Success');
            }
            if(user.Type === 'Admin'){
                return res.redirect('/Admin');
            }
            return res.redirect('/User');
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
    const Type = req.body.Type;

    if(Password != RepeatPassword){
        req.flash('error', 'Passwords does not match');
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
                if(Type === 'Provider' || Type === 'Admin'){
                    PendingDB.create({
                        UserID : Email,
                        Date : new Date().getTime(),
                        Type : Type
                    });
                    UserDB.create({
                        Email : Email,
                        Password : hashedPassword,
                        Type : "Pending"
                    });
                } else {
                    UserDB.create({
                        Email : Email,
                        Password : hashedPassword,
                        Type : Type
                    });
                }
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

exports.postReject = (req, res) => {
    const ID = req.body.ID
    PendingDB.findOne({
        where: {
            id: ID
        }
    })
    .then(result => {
        UserDB.destroy({
            where: 
            {
                Email: result.UserID
            }
        })
        PendingDB.destroy({
            where: {
                id: ID
            }
        })
    })

    res.redirect('/Admin');
}

exports.postApprove = (req, res) => {
    const ID = req.body.ID
    var Type
    var UserID
    var Key
    const AreaCode = "9000"
    var Now = new Date().getTime().toString()

    PendingDB.findOne({
        where: {
            id: ID
        }
    })
    .then(async result => {
        if(result.Type === 'Provider'){
            Type = 'Create Provider'
            UserID = SHA256(result.UserID, result.Date).toString()
            await CreateBlock(Type, UserID, false, '*')//Add to blockchain here
            
            UserDB.update({Type : result.Type, HashID: UserID}, {where: {Email: result.UserID}});
        } else if (result.Type === 'Node'){
            Type = 'Create Node'
            UserID = SHA256(result.UserID, Now).toString()
            await CreateBlock(Type, UserID, Area = AreaCode)
        }
        ApiKeys.findOne({
            where: {
                HashID : UserID
            }
        })
        .then(result => {
            if (result){
                res.redirect('/Admin');
            }
        
            Key = SHA256(UserID, "none", "hashthis").toString()
            ApiKeys.create({
                Key : Key,
                HashID : UserID
            })
        })
        PendingDB.destroy({
            where: {
                id: ID
            }
        })
        res.redirect('/Admin');
    })

}