const socketIO = require('socket.io');

module.exports = (server) => {
  const io = socketIO(server);

  io.on('connection', (socket) => {
    console.log('New user connected.');

    socket.on('disconnect', () => {
      console.log('User disconnected.');
    });
  });

  return io;
};
