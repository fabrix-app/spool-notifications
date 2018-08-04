'use strict'
// const _ = require('lodash')
const Generic = require('@fabrix/spool-generics').Generic
module.exports = class FakeEmailProvider extends Generic {

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
