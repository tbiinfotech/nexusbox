"use strict";
const fs = require("fs"),
  path = require("path");
  const  sequelize  = require('./db/db');
require("dotenv").config({
  path: __dirname + "/.env",
});
const bodyParser = require("body-parser");


// Set Global
global.appRoot = __dirname;

const express = require("express");
const cors = require("cors");

// initiate App with express module.
let app = express();
app.use(cors());

// sequelize.authenticate()
//   .then(() => console.log('Database connected...'))
//   .catch(err => console.log('Error: ' + err))

  sequelize.sync()
  .then(() => console.log('Database connected successfully...'))
  .catch(err => console.log('Error: '+ err));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



app.use(express.static(path.join(__dirname, 'public')));

// Include Services API File
app.use(require("./src/Services"));
// app.use(express.static(path.join(__dirname, "./react/dist")));

// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "./react/dist/index.html"));
// });

/*** Create HTTPs server. ***/
let http_options = {};
let https = require("https");


if (process.env.SITE_ENVIREMENT == 'development') {
  console.log('stack server entry');
  http_options = {
    ...http_options,
    key: fs.readFileSync('/etc/apache2/ssl/private.key'),
    cert: fs.readFileSync('/etc/apache2/ssl/STAR_brstdev_com.crt'),
    ca: [fs.readFileSync('/etc/apache2/ssl/My_CA_Bundle.ca-bundle')],
  };

  const https_port = process.env.HTTPS_PORT || '8006';
  var httpsServer = https.createServer(http_options, app);
  httpsServer.listen(https_port, () => {
    console.log(`httpsServer App started on port ${https_port}`);
  });

} else if (process.env.SITE_ENVIREMENT == 'production') {
  console.log('production');

  // http_options = {
  //   ...http_options,
  //   key: fs.readFileSync(
  //     '/etc/letsencrypt/live/app.secureaz.co.nz/privkey.pem'
  //   ),
  //   cert: fs.readFileSync(
  //     '/etc/letsencrypt/live/app.secureaz.co.nz/fullchain.pem'
  //   ),
  // };

  const https_port = process.env.HTTPS_PORT || '8006';
  var httpsServer = https.createServer(http_options, app);
  httpsServer.listen(https_port, () => {
    console.log(`httpsServer App started on port ${https_port}`);
  });

} else {
  // /*** Get port from environment and store in Express. ***/
  const http_port = process.env.HTTP_PORT || 8007;
  const httpServer = require('http').Server(app);
  httpServer.listen(http_port, function () {
    console.log(`httpServer App started on port ${http_port}`);
  });

}


