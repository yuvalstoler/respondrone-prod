var path = require('path');
var fs = require('fs');
var express = require('express');
var app = express();
//var logger = require('./logger');
var projConf = require('../../projConf')

//require('./../webServer/dist/index');
app.use(express.static(path.join(__dirname, '../oscc/dist/drones')));
console.log(path.join(__dirname, '../oscc/dist/oscc'))
app.get('*', function (req, res) {
    res.redirect('/');
});

var http = require('http');


let port = 7777;


app.set('port', port);
var server = http.createServer(app);

server.listen(port);
server.on('error', function (e) {
    console.log(JSON.stringify(e));
});
server.on('listening', onListening);


function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
//    logger.info('UIService', 'Listening on ' + bind);
    console.log('Listening on ' + bind);
}
