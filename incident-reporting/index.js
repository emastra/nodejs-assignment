const NATS = require('nats');
const http = require('http');
const mongoose = require('mongoose');
const socketIO = require('socket.io');

const { Incident, checkIncidents } = require('./models/incident');

const server = http.createServer();
const io = socketIO(server);

mongoose.connect('mongodb://localhost:27017/IncidentsDB', { useNewUrlParser: true })
  .then(() => console.log('incident-reporting: Connected to IncidentsDB.'))
  .catch(() => console.error('incident-reporting: Error connecting to IncidentsDB.'));

io.on('connection', (socket) => {
  console.log('New user connected.');

  socket.on('disconnect', () => {
    console.log('User disconnected.');
  });
});

const nc = NATS.connect({json: true});

nc.on('connect', (c) => {
  console.log(`incident-reporting: nc: Connected to ${c.currentServer.url.host}.`);
});

nc.subscribe('vehicle.*', async function(msg, reply, subject) {
  if (!msg) return;

  const { error } = checkIncidents(msg);
  if (!error) return;

  // console.log('INCIDENT:', error.details[0]);

  let incident = new Incident({
    vehicle: subject.split('.')[1],
    time: msg.time,
    energy: msg.energy,
    gps: msg.gps,
    odo: msg.odo,
    speed: msg.speed,
    soc: msg.soc,
    alarm: {
      key: error.details[0].context.key,
    	message: error.details[0].message,
    }
  });

  try {
    let doc = await incident.save();

    io.emit('newIncident', doc);
  } catch(err) {
    console.log(err);
  }

});

nc.on('error', (err) => {
  console.log('incident-reporting: nc:', err);

  nc.close();
});

nc.on('close', () => {
  console.log('incident-reporting: nc: Connection closed. Exit.');

  process.exit();
});


server.listen('3001', () => {
  console.log('incident-reporting: Server is up on port 3001.');
});
