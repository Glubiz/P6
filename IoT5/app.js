const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const cors = require('cors');
const csrf = require('csurf')

const errorController = require('./controllers/error');
const app = express();
const csrfProtection = csrf();

app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, '/public')));

app.use(flash());
app.use(csrfProtection);

const apiRoutes = require('./routes/api');

app.use(cors())
app.use(apiRoutes);

app.use(errorController.get404);

app.listen(5059)