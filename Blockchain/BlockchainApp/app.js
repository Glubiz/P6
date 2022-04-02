const path = require('path');
const sequelize = require('./util/db');
const express = require('express');
const Session = require('express-session');
const bodyParser = require('body-parser');
const MySQLStore = require('express-mysql-session')(Session);
const flash = require('connect-flash');
const cors = require('cors');
const csrf = require('csurf')

const options = {
	host: 'web1.netgiganten.dk',
	port: 3306,
	user: 'damibfko_iot',
	password: 'c@5fK*8DBhVl',
	database: 'damibfko_bachelor'
};
// const BlockChain = require('./middleware/blockchain');
const errorController = require('./controllers/error');
const app = express();
const sessionStore = new MySQLStore(options);
const csrfProtection = csrf();

app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, '/public')));

app.use(Session({
  key: 'Login_cookie',
	secret: 'ThisIsASecretStringUsedToEncryptTheCookie32',
	store: sessionStore,
	resave: false,
	saveUninitialized: false
}));

app.use(flash());
app.use(csrfProtection);

const mainRoutes = require('./routes/main');
const apiRoutes = require('./routes/api');
const authRoutes = require('./routes/auth');

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn
  res.locals.userName = req.session.userName
  res.locals.UserID = req.session.userID
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use(cors())
app.use(mainRoutes);
app.use(apiRoutes);
app.use(authRoutes);

app.use(errorController.get404);

sequelize
  .sync()
  .then(result => {
    app.listen(3033, '0.0.0.0');
  })
  .catch(err => {
    console.log(err);
  });