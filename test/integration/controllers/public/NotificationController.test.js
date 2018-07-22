'use strict'
/* global describe, it */
const assert = require('assert')
const supertest = require('supertest')
const _ = require('lodash')

describe('Public NotificationController', () => {
  let request, publicUser
  let NotificationService
  let Notification
  let User
  let userID

  before((done) => {
    request = supertest('http://localhost:3000')
    publicUser = supertest.agent(global.app.packs.express.server)
    done()
  })

  it('should exist', () => {
    assert(global.app.api.controllers['NotificationController'])
    NotificationService = global.app.services['NotificationService']
    Notification = global.app.models['Notification']
    User = global.app.models['User']
  })

  it('should not get notifications', (done) => {
    publicUser
      .get('/notifications')
      .expect(403)
      .end((err, res) => {
        done(err)
      })
  })

  it('should not get user notifications by user id', (done) => {
    publicUser
      .get('/user/1/notifications')
      .expect(403)
      .end((err, res) => {
        done(err)
      })
  })
  it('should not get user notifications', (done) => {
    publicUser
      .get('/user/notifications')
      .expect(403)
      .end((err, res) => {
        done(err)
      })
  })

})
