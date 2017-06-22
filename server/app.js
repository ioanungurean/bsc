const webpack = require('webpack');
const webpackConfig = require('../devtools/webpack.config')({ environment: 'prod' });
const compiler = webpack(webpackConfig);

let app = require('express')();
app.use(require('webpack-dev-middleware')(compiler));
let server = require('http').createServer(app);
let io = require('socket.io')(server);

server.listen(3000);

// handle socket events
let players = {};
io.sockets.on('connection', (socket) => {
  console.log('user connected');

  socket.on('new player', (username) => {
    players[socket.id] = {
      username: username
    };
    console.log(players);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});
