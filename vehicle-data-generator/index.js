
/*

In this file you will find how we send raw data to other services via nats
There are 2 question points for you to tell us the answer on your presentation
If you're up for it

*/
const csvParse      = require ( "csv-parse")
const fs            = require ( "fs")
const Writable      = require ("stream").Writable

// NATS Server is a simple, high performance open source messaging system
// for cloud native applications, IoT messaging, and microservices architectures.
// https://nats.io/
// It acts as our pub-sub (https://en.wikipedia.org/wiki/Publish%E2%80%93subscribe_pattern)
// mechanism for other service that needs raw data
const NATS = require("nats")

// At this point, do not forget to run NATS server!

// NATS connection happens here
// After a connection is made you can start broadcasting messages (take a look at nats.publish())
const nats = NATS.connect({json: true})

const routeArr = [] // const

// This function will start reading out csv data from file and publish it on nats
const readOutLoud = (vehicleName) => {
	// Read out meta/route.csv and turn it into readable stream
	const fileStream = fs.createReadStream("./meta/route.csv")
	// =========================
	// Question Point 1:
	// What's the difference betweeen fs.createReadStream, fs.readFileSync, and fs.readFileAsync?
	// And when to use one or the others
	// =========================

	// Now comes the interesting part,
	// Handling this filestream requires us to create pipeline that will transform the raw string
	// to object and sent out to nats
	// The pipeline should looks like this
	//
	//  File -> parse each line to object -> published to nats
	//

	let i = 0

	return (fileStream
		// Filestream piped to csvParse which accept nodejs readablestreams and parses each line to a JSON object
		.pipe(csvParse({ delimiter: ",", columns: true, cast: true }))
		// Then it is piped to a writable streams that will push it into nats
		.pipe(new Writable({
			objectMode: true,
			// NEW WRITABLE CREATES A WR OBJ. WRITE METHOD HERE RUNS EVERYTIME IT WRITE. UNDERTHEHOOD SETS _write internal method. cb dovrebbe esse chiamato next.
			write(obj, enc, cb) {
				// setTimeout in this case is there to emulate real life situation
				// data that came out of the vehicle came in with irregular interval
				// Hence the Math.random() on the second parameter
				setTimeout(() => {

					i++
					if((i % 100) === 0)
						console.log(`vehicle ${vehicleName} sent have sent ${i} messages`)

					// The first parameter on this function is topics in which data will be broadcasted
					// it also includes the vehicle name to seggregate data between different vehicle

					// STO CB SAREBBE IL NEXT CHE VIENE PASSATO A WRITE QUI SOPRA. E POI PUBLISH CHIAMA NEXT QUANDO HA FINITO IL PUBLISH. QUINDI IL WRITE CONTINUA CON L'OGGETTO SEGUENTE
					nats.publish(`vehicle.${vehicleName}`, obj, cb)

					routeArr.push(obj)

				}, Math.ceil(Math.random() * 150))
			}
		})))
	// =========================
	// Question Point 2:
	// What would happend if it failed to publish to nats or connection to nats is slow?
	// Maybe you can try to emulate those slow connection
	// =========================
}

// This next few lines simulate Henk's (our favorite driver) shift
console.log("Henk checks in on test-bus-1 starting his shift...")
readOutLoud("test-bus-1")
	.once("finish", () => {
		console.log("henk is on the last stop and he is taking a cigarrete while waiting for his next trip")
		setTimeout(() => {
			console.log("Henk starts his return trip on test-bus-1...")
			driveReverse("test-bus-1", routeArr, () => {
				console.log("Henk finished the round trip.")
			})
		}, 10000)
	})

// To make your presentation interesting maybe you can make henk drive again in reverse
function driveReverse(vehicleName, routeArr, callback) {
	const routeArrRev = routeArr.slice().reverse();
	// let counter = 1;
	let i = 0;
	const maxLoops = routeArrRev.length - 1;

	// https://patrickmuff.ch/blog/2014/03/12/for-loop-with-delay-in-javascript/
	// because a for-loop is synchronous while setTimout is asynchronous
	(function next() {
		// stop condition // i+1
    if (i++ > maxLoops) return callback();

    setTimeout(() => {
			// i++;
      if((i % 100) === 0) console.log(`vehicle ${vehicleName} sent have sent ${i} messages`);
			nats.publish(`vehicle.${vehicleName}`, routeArrRev[i]);
      next();
    }, 150);
	})();
}
