const express =require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const flash = require('express-flash');


const db = require('./db/mongodb');
const router = require('./router');

app.use(flash())
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json({ type: 'application/json' }));

//Flashing
//app.use(require('connect-flash-plus')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

app.use('/public/', express.static('public'));
app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, 'views'));
app.use('/upload', express.static(__dirname + '/upload'));

app.use(session({
    secret: "SBCCprojectsecretkey",
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 3600000,
        //secure : true
    }
}));

app.use('', router);

app.listen(8080, (err, result) => {
    if (err) {
        console.log("server error", err)
    }
    else {
        console.log("Server is listening at 8080");

    }
})