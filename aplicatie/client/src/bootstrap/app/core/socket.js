import io from 'socket.io-client';

export const socket = (() => {
  let ws = io('http://localhost:3000/');
  ws.on('connect', () => {
    console.log('ws: connected to server');

    ws.on('disconnect', () => {
      console.log('ws: disconnect from server');
      ws.close();
    });
  });

  return {
    on: (evname, cb) => {
      ws.on(evname, (socket) => {
        cb(socket);
      });
    },

    emit: (evname, obj) => {
      ws.emit(evname, obj);
    }
  };
})();
