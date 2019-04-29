const http = require('http');
const serveStatic = require('./utils/serveStatic');

const server = http.createServer((req, res) => {
  console.log(`${req.method} ${req.url}`);

  serveStatic(req, res);
});

server.listen(8000, () => {
  console.log('http-server: Server is up on port 8000.');
});

















// const http = require('http');
//
// const server = http.createServer(function(request, response) {
//   let parsedURL = url.parse(request.url);
//   let route = routes[parsedURL.pathname];
//   let filepath = decodeURIComponent(parsedURL.pathname);
//
//   if (route) {
//     route(request, response);
//   } else if (fileExists(filepath) || request.method == 'POST') {
//     handler(filepath, request, response);
//   } else {
//     staticServer(request, response);
//   }
// });
//
// server.listen(port, () => {
//   console.log(`Server is up on port ${port}`);
// });
