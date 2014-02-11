'use strict';


var kraken = require('kraken-js'),
// e_static = require('node-static'),
express = require('express'),
socketApp = express(),
port = 2013,
http = require('http'),

app = {};


app.configure = function configure(nconf, next) {
    // Async method run on startup.
    next(null);
};


app.requestStart = function requestStart(server) {
    // Run before most express middleware has been registered.
};


app.requestBeforeRoute = function requestBeforeRoute(server) {
    // Run before any routes have been added.
};


app.requestAfterRoute = function requestAfterRoute(server) {
    // Run after all routes have been added.
};


if (require.main === module) {
    kraken.create(app).listen(function (err, server) {
    if (err) {
    console.error(err);
    }
    var io = require('socket.io').listen(server);
    //added for heroku
    io.configure(function () {
    io.set("transports", ["xhr-polling"]);
    io.set("polling duration", 10);
    });
    io.sockets.on('connection', function(socket) {
    // socket.emit('news', { hello: 'world' });
    socket.on('message', function (message) {
        console.log('Got message: ', message);
        socket.broadcast.emit('message', message); // should be room only
    });

    socket.on('create or join', function (room) {
        var numClients = io.sockets.clients(room).length;
        console.log('Room ' + room + ' has ' + numClients + ' client(s)');
        console.log('Request to create or join room', room);
        if (numClients == 0){
            socket.join(room);
	    socket.emit('created', room);
        } else if (numClients == 1) {
	    io.sockets.in(room).emit('join', room);
	    socket.join(room);
	    socket.emit('joined', room);
        } else { // max two clients
	    socket.emit('full', room);
        }
        socket.emit('emit(): client ' + socket.id + ' joined room ' + room);
        socket.broadcast.emit('broadcast(): client ' + socket.id + ' joined room ' + room);
	});
    });
});
}

module.exports = app;
