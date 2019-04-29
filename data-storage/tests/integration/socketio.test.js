require('../../config/config.js');

let client = require('socket.io-client');

let server;
let io;
let socket1;


describe('Socket.io server', () => {
  beforeEach((done) => {
    server = require('../../startup/server');
    io = require('../../startup/socketio')(server);
    server = server.listen(process.env.PORT, () => {
      done();
    });
  });
  afterEach((done) => {
    socket1.disconnect();
    io.close(() => {
      server.close(() => {
        done();
      });
    });
  });

  describe('connection event', () => {
    it('client should connect to server', (done) => {
      io.on('connection', (socket) => {
        expect(socket.connected).toEqual(true);
        done();
      });

      socket1 = client(`http://localhost:${process.env.PORT}/`);
    });
  });

  describe('newMessage event', () => {
    it('client should receive the message from server', (done) => {
      const doc = {
        time: 1511512585495,
        energy: 85.14600000000002,
        gps: '52.08940124511719|5.105764865875244',
        odo: 5.381999999997788,
        speed: 12,
        soc: 88.00000000000007
      };

      socket1 = client(`http://localhost:${process.env.PORT}/`);

      socket1.on('connect', () => {
        io.emit('newMessage', doc);
      });

      socket1.on('newMessage', (msg) => {
        expect(msg).toEqual(doc);
        done();
      });
    });
  });

});
