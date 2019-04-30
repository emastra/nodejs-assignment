const NATS = require('nats');
const { Vehicle, validate } = require('../models/vehicle');

module.exports = (io) => {
  const nc = NATS.connect({json: true});

  nc.on('connect', (c) => {
    console.log(`data-storage: nc: Connected to ${c.currentServer.url.host}.`);
  });

  nc.subscribe('vehicle.*', async function(msg, reply, subject) {
    if (!msg) return;
    
    const { error } = validate(msg);
    if (error) return console.log('nc validate:', error.details[0].message, msg);

    let vehicle = new Vehicle({
      vehicle: subject.split('.')[1],
      time: msg.time,
      energy: msg.energy,
      gps: msg.gps,
      odo: msg.odo,
      speed: msg.speed,
      soc: msg.soc
    });

    try {
      let doc = await vehicle.save();

      io.emit('newMessage', doc);
    } catch (err) {
      console.log(err);
    }

  });

  nc.on('error', (err) => {
    console.log('data-storage: nc:', err);

    nc.close();
  });

  nc.on('close', () => {
    console.log('data-storage: nc: Connection closed. Exit.');

    process.exit(0);
  });
};
