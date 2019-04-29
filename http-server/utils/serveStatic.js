const url = require('url');
const fs = require('fs');
const path = require('path');
const mimeTypes = require('./mimeTypes');

module.exports = (req, res) => {
  const parsedUrl = url.parse(req.url);
  let pathname = decodeURIComponent(path.join(__dirname, '../public', parsedUrl.pathname));

  if (req.url == '/') {
    pathname += 'index.html';
  }

  fs.exists(pathname, (exist) => {
    if(!exist) {
      // if the file is not found, return 404
      res.statusCode = 404;
      return res.end(`File not found!`);
    }
    // read file from file system
    fs.readFile(pathname, (err, data) => {
      if(err){
        res.statusCode = 500;
        res.end(`Error getting the file: ${err}.`);
      } else {
        // extract the file extention
        const ext = path.parse(pathname).ext;
        // set Content-type and send data
        res.setHeader('Content-type', mimeTypes[ext] || 'text/plain' );
        res.end(data);
      }
    });
  });
};
