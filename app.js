const express = require('express');
const http = require('http')

// == set up the express server
const app = express();
let server;       // http server

// == Set up to use the static location
app.use(express.static('./dist'))

// == create HTTP server
server = http.createServer(app)

// == Start the server
server.listen(8080, ()=>{console.log('listening on http://localhost:8080')})