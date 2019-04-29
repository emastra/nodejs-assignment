require('../../config/config.js');
require('../../db/db.js')();

const request = require('supertest');
const { Vehicle } = require('../../models/vehicle');

let server;


describe('/api/vehicles', () => {
  beforeEach((done) => {
    server = require('../../startup/server');
    server.listen(process.env.PORT, () => {
      done();
    });
  });
  afterEach(async (done) => {
    await Vehicle.deleteMany({});
    server.close(() => {
      done();
    });
  });

  describe('GET /', () => {
    it('should return all vehicles messages', async (done) => {
      const docs = [
        { vehicle: 'bus-1', time: 1, energy: 1.1, gps: ['1.1','1.1'], odo: 1.1, speed: 1, soc: 1.1 },
        { vehicle: 'bus-2', time: 2, energy: 2.2, gps: ['2.2','2.2'], odo: 2.2, speed: 2, soc: 2.2 }
      ];

      await Vehicle.insertMany(docs);

      const res = await request(server).get('/api/vehicles');

      expect(res.status).toBe(200);
      expect(Array.isArray([res.body])).toBe(true);
      expect(res.body).toHaveLength(2);
      expect(res.body.some(doc => doc.vehicle === 'bus-1')).toBe(true);
      expect(res.body.some(doc => doc.vehicle === 'bus-2')).toBe(true);

      done();
    });
  });

  describe('GET /:vehicle', () => {
    it('should return all messages of specified vehicle if vehicle name exists', async (done) => {
      const docs = [
        { vehicle: 'bus-1', time: 1, energy: 1.1, gps: ['1.1','1.1'], odo: 1.1, speed: 1, soc: 1.1 },
        { vehicle: 'bus-2', time: 1, energy: 1.1, gps: ['1.1','1.1'], odo: 1.1, speed: 1, soc: 1.1 },
        { vehicle: 'bus-1', time: 2, energy: 2.2, gps: ['2.2','2.2'], odo: 2.2, speed: 2, soc: 2.2 }
      ];

      await Vehicle.insertMany(docs);

      const res = await request(server).get('/api/vehicles/bus-1');

      expect(res.status).toBe(200);
      expect(Array.isArray([res.body])).toBe(true);
      expect(res.body).toHaveLength(2);
      expect(res.body.every(doc => doc.vehicle === 'bus-1')).toBe(true);

      done();
    });

    it('should return an empty array if vehicle name does not exist', async (done) => {
      const docs = [
        { vehicle: 'bus-1', time: 1, energy: 1.1, gps: ['1.1','1.1'], odo: 1.1, speed: 1, soc: 1.1 },
        { vehicle: 'bus-2', time: 1, energy: 1.1, gps: ['1.1','1.1'], odo: 1.1, speed: 1, soc: 1.1 },
        { vehicle: 'bus-1', time: 2, energy: 2.2, gps: ['2.2','2.2'], odo: 2.2, speed: 2, soc: 2.2 }
      ];

      await Vehicle.insertMany(docs);

      const res = await request(server).get('/api/vehicles/bus-3');

      expect(res.status).toBe(200);
      expect(Array.isArray([res.body])).toBe(true);
      expect(res.body).toHaveLength(0);

      done();
    });
  });

  describe('GET /:vehicle/last-update', () => {
    it('should return the last message of specified vehicle if vehicle name exists', async (done) => {
      const docs = [
        { vehicle: 'bus-1', time: 1, energy: 1.1, gps: ['1.1','1.1'], odo: 1.1, speed: 1, soc: 1.1 },
        { vehicle: 'bus-2', time: 1, energy: 1.1, gps: ['1.1','1.1'], odo: 1.1, speed: 1, soc: 1.1 },
        { vehicle: 'bus-1', time: 2, energy: 2.2, gps: ['2.2','2.2'], odo: 2.2, speed: 2, soc: 2.2 },
        { vehicle: 'bus-1', time: 3, energy: 3.3, gps: ['3.3','3.3'], odo: 3.3, speed: 3, soc: 3.3 }
      ];

      await Vehicle.insertMany(docs);

      const res = await request(server).get('/api/vehicles/bus-1/last-update');

      expect(res.status).toBe(200);
      expect(res.body).toBeTruthy();
      expect(res.body).toHaveProperty('vehicle', 'bus-1');
      expect(res.body.time).toBe(3);

      done();
    });
  });

});
