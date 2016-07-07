function socketDispatch(message, socket, worker) {
  if (message) {
    socket.broadcast.emit('job', {message: message, worker: worker})
    return true
  } else {
    return false
  }
}

export default function pubsub(socket) {
  var listeners = []
  var psChannles = Object.create(null)

  function publish(channel, worker, message) {
    const subs = psChannles.channel
    return new Promise((resolve, reject) => {
      socketDispatch(subs.worker.message, socket, worker) ?
                  resolve({info: 'processing'}) :
                  reject({status: 500, error: 'message does not exist.'})
    })
  }

  function subscribe(channel, worker, message) {
    return new Promise((resolve, reject) => {
      var subs = psChannles.channel

      if (subs.worker) {
        if (message in subs.worker) {
          reject({error: `message:${message} exists`, worker: 'worker'})
        } else {
          subs.worker.add(message)
          resolve({info: 'add message succeed', worker: 'worker'})
        }
      } else {
        var messages = new Set()
        messages.add(message)
        subs.worker = messages
        resolve({info: 'add channel succeed', worker: 'worker'})
      }
    })
  }

  function unsubscribe(channel, worker) {
    return new Promise((resolve, reject) => {
      var subs = psChannles.channel
      var index = subs.indexOf(worker)
      if (index > -1) {
        subs.splice(index, 1)
        resolve({info: 'unsubscribe succeed', worker: 'worker'})
      } else {
        reject({error: `can not find channel: ${channel}`, worker: 'worker'})
      }
    })
  }

  return {
    subscribe,
    unsubscribe,
    publish
  }
}
