const mongoose = require('mongoose');

// mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true })
//   .then(() => console.log('data-storage: Connected to VehicleDB.'))
//   .catch(() => console.log('data-storage: Error connecting to VehicleDB.'));
//
// module.exports = {
//   mongoose
// }

module.exports = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true });

    console.log('data-storage: Connected to VehicleDB.');
  } catch(err) {
    console.log('data-storage: Error connecting to the database:', err);
    console.log('data-storage: Exit process.');
    process.exit(1);
  }

}
