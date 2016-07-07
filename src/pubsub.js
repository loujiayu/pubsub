function socketDispatch(message, socket, worker) {
  socket.emit('start job', {message: message, worker: worker})
}

export default function pubsub(socket) {
  var listeners = []
  var psChannles = Object.create(null)

  function publish(channel, worker, message) {
    const subs = psChannles[channel]
    return new Promise((resolve, reject) => {
      if (!subs[worker].has(message)) {
        reject({status: 404, error: 'message does not exist.'})
      } else {
        socketDispatch(message, socket, worker)
        socket.on('finish job', (info) => {
          resolve(info)
        })
      }
    })
  }

  function subscribe(channel, worker, message) {
    return new Promise((resolve, reject) => {
      var subs = psChannles[channel]
      subs = subs || {}

      if (subs[worker]) {
        if (subs[worker].has(message)) {
          reject({error: `message:${message} exists`, worker: worker})
        } else {
          subs[worker].add(message)
          resolve({info: 'add message succeed', worker: worker})
        }
      } else {
        var messages = new Set()
        messages.add(message)
        subs[worker] = messages
        psChannles[channel] = subs
        resolve({info: 'add channel succeed', worker: worker})
      }
    })
  }

  function unsubscribe(channel, worker) {
    return new Promise((resolve, reject) => {
      var subs = psChannles[channel]
      var index = subs.indexOf(worker)
      if (index > -1) {
        subs.splice(index, 1)
        resolve({info: 'unsubscribe succeed', worker: worker})
      } else {
        reject({error: `can not find channel: ${channel}`, worker: worker})
      }
    })
  }

  function getState() {
    return psChannles
  }

  return {
    subscribe,
    unsubscribe,
    publish,
    getState
  }
}
