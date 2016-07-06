var EventEmitter = require('events').EventEmitter
var util = require('util')
var app = require('express')()
var bodyParser = require('body-parser')
var http = require('http')
var server = http.createServer(app)
var io = require('socket.io').listen(server)

function myEmitter() {
  EventEmitter.call(this);
}

util.inherits(myEmitter, EventEmitter)

app.use(bodyParser.json())

app.post('/send', function(req, res) {
  // TODO: ....
  res.json(req.message)
});

io.sockets.of('/sock').on('connection', function() {
  // TODO: ....
})
