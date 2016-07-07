import express from 'express'
import bodyParser from 'body-parser'
import http from 'http'
import socketIO from 'socket.io'

import pubsub from './pubsub'

const app = express()
const server = http.createServer(app)
const io = socketIO(server)

// http 服务开启
function startHttpServer(publish) {
  app.use(bodyParser.urlencoded({ extended: false }))

  app.post('/send', function(req, res) {
    const {channel, worker, message} = req.body

    publish(channel, worker, message).then((result) => {
      res.json(result)
    }, (reason) => {
      console.log(`api error`)
      res.status(reason.status || 500).json(reason)
    })
  });
}

// socket
io.of('/sock').on('connection', function(socket) {
  const {subscribe, unsubscribe, publish, getState} = pubsub(socket)

  startHttpServer(publish)

  socket.on('subscribe', function(data) {
    const {channel, worker, message} = data

    subscribe(channel, worker, message).then((result) => {
      socket.emit('status', result)
      console.log(getState());
    }, (reason) => {
      socket.emit('status', reason)
    })
  })

  socket.on('unsubscribe', function(data) {
    const {channel, worker} = data

    unsubscribe(channel, worker).then((result) => {
      socket.emit('status', result)
    }, (reason) => {
      socket.emit('status', reason)
    })
  })
})

server.listen(8000, function() {
  console.log('server listen on http://localhost:8000')
})
