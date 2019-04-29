var socket1 = io('http://localhost:3000');
var socket2 = io('http://localhost:3001');

var buses = [];
var selectedBus = 'test-bus-1';


socket1.on('connect', function() {
  console.log('Connected to Data-storage server');

  // on newMessage
  socket1.on('newMessage', function(doc) {
    if (!buses.includes(doc.vehicle)) {
      buses.push(doc.vehicle);

      var html = `<li><a href="#">${doc.vehicle}</a></li>`;

      document.getElementById('buses').insertAdjacentHTML('afterbegin', html);
    }

    if (doc.vehicle == selectedBus) {
      document.getElementById('current-speed').innerHTML = doc.speed;
      document.getElementById('state-charge').innerHTML = doc.soc;
      document.getElementById('energy').innerHTML = doc.energy;
      document.getElementById('odometer').innerHTML = doc.odo;
      document.getElementById('position').innerHTML = `${doc.gps[0].split('|')[0]},${doc.gps[0].split('|')[1]}`;
    }

  });
});


socket2.on('connect', function() {
  console.log('Connected to Incident-reporting server');

  let numberOfIncidents = 0;

  // on newIncident
  socket2.on('newIncident', function(doc) {
    if (doc.vehicle == selectedBus) {
      numberOfIncidents++;

      var html = `<li class="incident">
        <span><strong>Time:</strong> ${moment(doc.time).format('DD-MM-YY kk:mm:ss')}</span>
        <span><strong>Message:</strong> ${doc.alarm.message}</span>
        <span><strong>${doc.alarm.key}:</strong> ${doc[doc.alarm.key]}</span>
      </li>`;

      let nIncid = document.querySelector('#n-incidents');
      if (nIncid.style.backgroundColor = '#28ad06') nIncid.style.backgroundColor = 'red';

      document.getElementById('n-incidents').innerHTML = numberOfIncidents;
      document.getElementById('incident-list').insertAdjacentHTML('afterbegin', html);
    }
  });
});
