'use strict'
/* global describe, it */
const assert = require('assert')
const supertest = require('supertest')
const _ = require('lodash')

describe('Admin NotificationController', () => {
  let request, adminUser
  let NotificationService
  let Notification
  let User
  let userID

  before((done) => {
    request = supertest('http://localhost:3000')
    adminUser = supertest.agent(global.app.spools.express.server)

    adminUser
      .post('/auth/local')
      .set('Accept', 'application/json') //set header for this test
      .send({username: 'admin', password: 'admin1234'})
      .expect(200)
      .end((err, res) => {
        // console.log('THIS ADMIN', res.body)
        userID = res.body.user.id
        done(err)
      })
  })

  it('should exist', () => {
    assert(global.app.api.controllers['NotificationController'])
    NotificationService = global.app.services['NotificationService']
    Notification = global.app.models['Notification']
    User = global.app.models['User']
  })

  it('should get notifications', (done) => {
    adminUser
      .get('/notifications')
      .expect(200)
      .end((err, res) => {
        // console.log('NOTIFICATIONS',res.body)
        assert.ok(res.headers['x-pagination-total'])
        assert.ok(res.headers['x-pagination-pages'])
        assert.ok(res.headers['x-pagination-page'])
        assert.ok(res.headers['x-pagination-limit'])
        assert.ok(res.headers['x-pagination-offset'])

        assert.equal(_.isNumber(parseInt(res.headers['x-pagination-total'])), true)
        assert.equal(_.isNumber(parseInt(res.headers['x-pagination-offset'])), true)
        assert.equal(_.isNumber(parseInt(res.headers['x-pagination-limit'])), true)
        assert.equal(_.isNumber(parseInt(res.headers['x-pagination-page'])), true)
        assert.equal(_.isNumber(parseInt(res.headers['x-pagination-pages'])), true)

        assert.equal(res.body.length, 0)
        assert.equal(res.headers['x-pagination-total'], '0')
        done(err)
      })
  })

  it('should get user notifications by user id', (done) => {
    adminUser
      .get(`/user/${ userID }/notifications`)
      .expect(200)
      .end((err, res) => {
        // console.log('NOTIFICATIONS', err, res.body)
        assert.ok(res.headers['x-pagination-total'])
        assert.ok(res.headers['x-pagination-pages'])
        assert.ok(res.headers['x-pagination-page'])
        assert.ok(res.headers['x-pagination-limit'])
        assert.ok(res.headers['x-pagination-offset'])

        assert.equal(_.isNumber(parseInt(res.headers['x-pagination-total'])), true)
        assert.equal(_.isNumber(parseInt(res.headers['x-pagination-offset'])), true)
        assert.equal(_.isNumber(parseInt(res.headers['x-pagination-limit'])), true)
        assert.equal(_.isNumber(parseInt(res.headers['x-pagination-page'])), true)
        assert.equal(_.isNumber(parseInt(res.headers['x-pagination-pages'])), true)

        assert.equal(res.body.length, 0)
        assert.equal(res.headers['x-pagination-total'], '0')

        done(err)
      })
  })
  it('should get user notifications', (done) => {
    adminUser
      .get('/user/notifications')
      .expect(200)
      .end((err, res) => {
        assert.ok(res.headers['x-pagination-total'])
        assert.ok(res.headers['x-pagination-pages'])
        assert.ok(res.headers['x-pagination-page'])
        assert.ok(res.headers['x-pagination-limit'])
        assert.ok(res.headers['x-pagination-offset'])

        assert.equal(_.isNumber(parseInt(res.headers['x-pagination-total'])), true)
        assert.equal(_.isNumber(parseInt(res.headers['x-pagination-offset'])), true)
        assert.equal(_.isNumber(parseInt(res.headers['x-pagination-limit'])), true)
        assert.equal(_.isNumber(parseInt(res.headers['x-pagination-page'])), true)
        assert.equal(_.isNumber(parseInt(res.headers['x-pagination-pages'])), true)

        assert.equal(res.body.length, 0)
        assert.equal(res.headers['x-pagination-total'], '0')

        done(err)
      })
  })

})
