const path = require('path');
const sequelize = require('./util/db');
const express = require('express');
const Session = require('express-session');
const bodyParser = require('body-parser');
const MySQLStore = require('express-mysql-session')(Session);
const flash = require('connect-flash');
const cors = require('cors');
const csrf = require('csurf')
const app = express();


const options = {
  host: 'web1.netgiganten.dk',
	port: 3306,
	user: 'damibfko_iot',
	password: 'c@5fK*8DBhVl',
	database: 'damibfko_bachelor'
};
// const BlockChain = require('./middleware/blockchain');
const errorController = require('./controllers/error');
const sessionStore = new MySQLStore(options);

app.set('view engine', 'ejs');
app.set('views', 'views');

const apiRoutes = require('./routes/api');
app.use(apiRoutes);

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, '/public')));
const csrfProtection = csrf();

app.use(Session({
  key: 'Login_cookie',
	secret: 'ThisIsASecretStringUsedToEncryptTheCookie32',
	store: sessionStore,
	resave: false,
	saveUninitialized: false
}));

app.use(flash());

const mainRoutes = require('./routes/main');
const authRoutes = require('./routes/auth');

app.use(cors())

app.use(csrfProtection);
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn
  res.locals.Email = req.session.Email
  res.locals.UserID = req.session.userID
  res.locals.Type = req.session.Type
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use(mainRoutes);
app.use(authRoutes);
app.use(errorController.get404);

sequelize
  .sync()
  .then(result => {
    app.listen(process.env.PORT || 3033);
  })
  .catch(err => {
    console.log(err);
  });