function socketDispatch(message, socket, worker) {
  socket.emit('start job', {message: message, worker: worker})
}

export default function pubsub(socket) {
  var listeners = []
  var psChannles = Object.create(null)

  // 发送message到worker
  function publish(channel, worker, message) {
    const subs = psChannles[channel]
    return new Promise((resolve, reject) => {
      if (!subs || !subs[worker].has(message)) {
        reject({status: 404, error: 'message does not exist.'})
      } else {
        socketDispatch(message, socket, worker)
        socket.on('finish job', (info) => {
          resolve(info)
        })
      }
    })
  }

  // worker订阅信息
  function subscribe(channel, worker, message) {
    return new Promise((resolve, reject) => {
      var subs = psChannles[channel]
      subs = subs || {}

      if (subs[worker]) {
        if (subs[worker].has(message)) {
          reject({error: `message:${message} existed`, worker: worker})
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

  // worker 取消订阅
  function unsubscribe(channel, worker) {
    return new Promise((resolve, reject) => {
      var subs = psChannles[channel]
      if (!subs) {
        reject({error: 'channel does not exist'})
      } else {
        var index = subs.indexOf(worker)
        if (index > -1) {
          subs.splice(index, 1)
          resolve({info: 'unsubscribe succeed', worker: worker})
        } else {
          reject({error: `can not find channel: ${channel}`, worker: worker})
        }
      }
    })
  }

  // 获取pubsub信息 测试用
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
