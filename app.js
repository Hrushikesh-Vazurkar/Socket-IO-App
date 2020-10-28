var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var http = require("http");
var socketio = require("socket.io");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var loginRouter = require('./routes/login');

var app = express();

// Create the http server
const server = require('http').createServer(app);

// Create the Socket IO server on
// the top of http server
const io = socketio(server);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/login', loginRouter);

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
  res.render('error');
});

// io connections
io.on('connection',(socket)=>{
    console.log('user connected')

    socket.on('disconnect',()=>{
//        console.log('see you later alligator')
        io.emit('disconnect message','a user disc, see you later alligator')
    })

    // server captures 'chat message' and the actual message
    socket.on('chat message',(msg)=>{
//        console.log(msg)
        // server broadcasts it to every connected socket
        socket.broadcast.emit('chat message broadcasted' , msg)
    })

    socket.on('new user', (user)=>{
        console.log('in')
        console.log(user)
        io.emit('new user joined', user)
    })

    socket.on('name join', (name)=>{
        io.emit('print name' ,name)
    })

    socket.on('typing', (name)=>{
        socket.broadcast.emit('typing disp' ,name)
    })

    socket.on('stop typing', (name)=>{
        socket.broadcast.emit('stop typing name' ,name)
    })
})

module.exports = { app: app, server: server };
