'use strict'
// const _ = require('lodash')
module.exports = class FakeEmailProvider {
  constructor(options) {
    this.options = options
  }

  send(data) {
    const results = data.to.map(receiver => {
      return {
        status: 'success',
        email: receiver.email
      }
    })
    return Promise.resolve(results)
  }

  sendTemplate(data) {
    const results = data.to.map(receiver => {
      return {
        status: 'success',
        email: receiver.email
      }
    })
    return Promise.resolve(results)
  }
}
