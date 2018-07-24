'use strict'
/* global describe, it */
const assert = require('assert')
const supertest = require('supertest')
const _ = require('lodash')

describe('Registered NotificationController', () => {
  let request, registeredUser
  let NotificationService
  let Notification
  let User
  let userID, notificationToken

  before((done) => {
    request = supertest('http://localhost:3000')
    registeredUser = supertest.agent(global.app.spools.express.server)

    registeredUser.post('/auth/local/register')
      .send({
        email: 'notificationcontroller@example.com',
        password: 'admin1234'
      })
      .set('Accept', 'application/json')
      .expect(200)
      .end((err, res) => {
        assert.ok(res.body.user.id)
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

  it('should not get notifications', (done) => {
    registeredUser
      .get('/notifications')
      .expect(403)
      .end((err, res) => {
        done(err)
      })
  })

  it('should not get user notifications by user id', (done) => {
    registeredUser
      .get(`/user/${ userID }/notifications`)
      .expect(403)
      .end((err, res) => {
        done(err)
      })
  })
  it('should create a notification for user', (done) => {
    NotificationService.create({
      type: 'Test',
      text: 'Test Message'
    }, [ userID ])
      .then(notification => {
        notificationToken = notification.token
        assert.ok(notification.token)
        assert.equal(notification.type, 'Test')
        assert.equal(notification.text, 'Test Message')
        done()
      })
      .catch(err => {
        done(err)
      })
  })
  it('should get user notification by token', (done) => {
    registeredUser
      .get(`/user/notification/${notificationToken}`)
      .expect(200)
      .end((err, res) => {
        assert.ok(res.body.token)
        assert.equal(res.body.token, notificationToken)
        assert.equal(res.body.type, 'Test')
        assert.equal(res.body.subject, 'Test')
        assert.equal(res.body.text, 'Test Message')
        assert.equal(res.body.html, '<p>Test Message</p>\n')
        assert.equal(res.body.send_email, true)
        assert.equal(res.body.sent, true)
        assert.equal(_.isString(res.body.sent_at), true)
        // assert.equal(res.body.users.length, 1)
        done(err)
      })
  })
  it('should get user notifications', (done) => {
    registeredUser
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

        assert.equal(res.body.length, 1)
        assert.equal(res.headers['x-pagination-total'], '1')

        done(err)
      })
  })
})
