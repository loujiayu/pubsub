import express from 'express'
import bodyParser from 'body-parser'
import http from 'http'
import io from 'socket.io'

import pubsub from './pubsub'

const app = express()
const server = http.createServer(app)

var publish, subscribe, unsubscribe

io.sockets.of('/sock').on('connection', function(socket) {
  {publish, subscribe, unsubscribe} = pubsub(socket)

  socket.on('subscribe', function(data) {
    const {channel, worker, message} = data
    subscribe(channel, worker, message).then((result) => {
      socket.broadcast.emit('status', result)
    }, (reason) => {
      socket.broadcast.emit('status', reason)
    })
  })

  socket.on('unsubscribe', function(data) {
    const {channel, worker} = data
    unsubscribe(channel, worker).then((result) => {
      socket.broadcast.emit('status', result)
    }, (reason) => {
      socket.broadcast.emit('status', reason)
    })
  })
})

app.use(bodyParser.urlencoded({ extended: false }))
//
// app.post('/subscribe', function(req, res) {
//   const {channel, worker} = req.body
//   subscribe(channel, worker, message).then((result) => {
//     res.json(result)
//   }, (reason) => {
//     responseError(res, reason)
//   })
// })
//
// app.post('/unsubscribe', function(req, res) {
//   const {channel, worker} = req.body
//   unsubscribe(channel, worker).then((result) => {
//     res.json(result)
//   }, (reason) => {
//     responseError(res, reason)
//   })
// })

app.post('/send', function(req, res) {
  const {channel, worker, message} = req.body
  publish(channel, worker, message).then((result) => {
    res.json(result)
  }, (reason) => {
    console.log(`API ERROR ${reason}`)
    res.status(reason.status || 500).json(reason)
  })
});

server.listen(8000, function() {
  console.log('server listen on http://localhost:8000')
})
