var socket = require('socket.io-client')('http://localhost:8000/sock')

const name = 'demo'
// worker=demo&channel=channel1&message=email
function sendEmail() {
  return new Promise((resolve) => {
    setTimeout(resolve, 1000)
  })
}

socket.on('status', (stat) => {
  console.log(stat)
})

socket.on('start job', (data) => {
  const {worker, message} = data
  if (worker === name) {
    if (message === 'email') {
      sendEmail().then((resolve) => {
        // 通知客户端完成情况
        socket.emit('finish job', {info: 'email has sent.'})
      })
    }
  }
})

socket.emit('subscribe', {channel: 'channel1', worker: name, message: 'email'})
