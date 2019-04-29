require('../../config/config.js');

const request = require('supertest');
const { Vehicle } = require('../../models/vehicle');

let server;


describe('/api', () => {
  beforeEach((done) => {
    server = require('../../startup/server');
    server.listen(process.env.PORT, () => {
      done();
    });
  });
  afterEach((done) => {
    server.close(() => {
      done();
    });
  });

  describe('GET /', () => {
    it('should return a string', async (done) => {
      const res = await request(server).get('/api');

      expect(res.status).toBe(200);
      expect(typeof res.text).toBe('string');

      done();
    });
  });
});
