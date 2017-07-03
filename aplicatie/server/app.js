const webpack = require('webpack');
const webpackConfig = require('../devtools/webpack.config')({ environment: 'prod' });
const compiler = webpack(webpackConfig);

let app = require('express')();
app.use(require('webpack-dev-middleware')(compiler));
let server = require('http').createServer(app);
let io = require('socket.io')(server);

server.listen(3000);

let players = {};

// handle socket events
io.sockets.on('connection', (socket) => {
  console.log('ws: player connected');

  socket.on('new player', (username) => {
    players[socket.id] = {
      username: username
    };
    console.log(players);
  });
  socket.on('movement', (coords) => {
    socket.broadcast.emit('state', coords);
  });

  socket.on('disconnect', () => {
    console.log('ws: player disconnected');
    socket.emit('delete player', socket.id);

    delete players[socket.id];
  });
});
