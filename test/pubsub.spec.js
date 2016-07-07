import {expect} from 'chai'

import pubsub from '../src/pubsub'

describe('pubsub', () => {
  it('subscribe duplicate', () => {
    const {subscribe, unsubscribe, publish, getState} = pubsub()
    subscribe('channel1', 'demo', 'email1')
    subscribe('channel1', 'demo', 'email1').then((result) => {}, (reason) => {
      expect(reason).to.be.have.key('error')
    })
  })
  
  it('subscribe add', () => {
    const {subscribe, unsubscribe, publish, getState} = pubsub()
    subscribe('channel1', 'demo', 'email1')
    subscribe('channel1', 'demo', 'email2').then((result) => {
      const channels = getState()
      expect([...channels.channel1.demo]).to.eql(['email1','email2'])
    })
  })

  it('unsubscribe', () => {
    const {subscribe, unsubscribe, publish, getState} = pubsub()
    subscribe('channel1', 'demo', 'email1')
    unsubscribe('channel1', 'demo').then((result) => {
      const channels = getState()
      expect(channels.channel1.demo).to.not.exits
    })
  })
})
