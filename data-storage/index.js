const server = require('./startup/server');
const io = require('./startup/socketio')(server);

require('./config/config.js');
require('./db/db.js')();
require('./startup/nats')(io);

const port = process.env.PORT;
server.listen(port, () => console.log(`data-storage: Server is up on port ${port}.`));
