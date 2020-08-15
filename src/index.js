const http = require('http');
const express 	= require('express');
const socketio = require('socket.io');
const path 		= require('path');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const morgan = require('morgan');
const uuidv4 = require('uuid/v4');
const multer = require('multer');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const expressValidator = require('express-validator');

const app = express();
const server = http.createServer(app);
const io = socketio.listen(server);

require('./database');
require('./sockets')(io);
require('./config/passport');

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
  defaultLayout: 'main',
  layoutsDir: path.join(app.get('views'), 'layouts'),
  partialsDir: path.join(app.get('views'), 'partial'),
  extname: '.hbs',
  helpers: require('./helpers/handlebars')
}));
app.set('view engine', '.hbs');

// middlewares
//app.use(morgan('dev'));

app.use(express.urlencoded({extended: false}));

const storage = multer.diskStorage({
  destination: path.join(__dirname, 'public/img/img_Vacantes'),
  filename: (req, file, cb, filename) => {
      console.log(file);
      cb(null, uuidv4() + path.extname(file.originalname));
  }
});
app.use(multer({storage}).single('image'));

app.use(methodOverride('_method'));

 app.use(session({
 secret: 'secret',
 resave: true,
 saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
 
  res.locals.user = req.user || null;
  next();
});

app.use(require('./routes'));
app.use(require('./routes/usuarios'));
app.use(require('./routes/vacantes'));
app.use(require('./routes/notes'));


app.use(express.static(path.join(__dirname, 'public')));

server.listen(app.get('port'), () => {
  console.log('Server on port', app.get('port'));
});