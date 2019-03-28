let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let logger = require('morgan');
let cors = require('cors');
let sequelize = require('./models').sequelize;

const { secret } = require('./models');

const app = express();
const routes = require('./route');
const http = require('http');
const PORT = normalizePort(process.env.PORT || 3005);
app.set('port', PORT);
let server = http.createServer(app);

const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);

app.use(
  session({
    secret: secret, // 쿠키와 마찬가지로 아무 값이나 줘도 된다.
    resave: false, // 세션 아이디를 접속할 때마다 새롭게 발급할 것인가?
    saveUninitialized: true,
    store: new MySQLStore({
      host: sequelize.config.host,
      port: sequelize.config.port,
      user: sequelize.config.username,
      password: sequelize.config.password,
      database: sequelize.config.database
    })
  })
);

app.use(express.json());
// table 수정해야 할 때 사용하세요.
// sequelize.sync({ force: true });
sequelize.sync();

// api start
app.use('/', routes);

// 매치된 유저들을 보여준다.
/*
app.get('/api/users/match/:id', (req, res) => {
  let id = req.params.id;

  // Match.findAll({
  //   where: { user_id: id }
  // })
  //   .then(data => {
  //     if (data.length === 0) {
  //       return res.send('Match is nothing');
  //     } else {
  //       return res.send(data);
  //     }
  //   })
  //   .catch(err => {
  //     console.log(err);
  //     res.send(err).end();
  //   });
});
*/

// 매치를 취소한다. (delete match)
/*
app.post('/api/unmatch', (req, res) => {
  if (!req.session.displayName) {
    res.json({ error: 'Please Login!' });
  } else {
    User.findOne({
      where: { email: req.session.displayName }
    })
      .then(data => {
        let my_id = data.id;
        let delete_id = req.body.delete_id;

        // Match.destroy({
        //   where: { Match_ID: delete_id, user_id: my_id }
        // })
        //   .then(data2 => {
        //     if (data2 === 0) {
        //       return res.status(400).json({ error: 'Incorrect Id' });
        //     }

        //     Match.destroy({
        //       where: { Match_ID: my_id, user_id: delete_id }
        //     })
        //       .then(result => {
        //         console.log(result);
        //         res.json(result);
        //       })
        //       .catch(err => {
        //         console.log(err);
        //         res.send(err).end();
        //       });
        //   })
        //   .catch(err => {
        //     console.log(err);
        //     res.send(err).end();
        //   });
      })
      .catch(err => {
        console.log(err);
        res.send(err).end();
      });
  }
});
*/

app.use(cors());
app.use(logger('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send('error');
});

server.on('error', onError);
server.listen(PORT, () =>
  console.log(`Server started on port http://localhost:${PORT}/`)
);

function normalizePort(val) {
  let port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }

  if (port >= 0) {
    return port;
  }

  return false;
}

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  let bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`;

  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

module.exports = app;
