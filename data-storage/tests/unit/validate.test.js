const { validate } = require('../../models/vehicle');

describe('validateVehicle', () => {
  it('should return null if nats message is valid', () => {
    const msg = {
      time: 1511512585495,
      energy: 85.14600000000002,
      gps: '52.08940124511719|5.105764865875244',
      odo: 5.381999999997788,
      speed: 12,
      soc: 88.00000000000007
    }

    const { error } = validate(msg);

    expect(error).toBeNull();
  });

  it('should return an error object if nats message is invalid', () => {
    const msg = {
      time: 'a',
      energy: 'a',
      gps: '1|1',
      odo: 'a',
      speed: 'a',
      soc: 'a'
    }

    const { error } = validate(msg);

    expect(error).not.toBeNull();
  });
});
