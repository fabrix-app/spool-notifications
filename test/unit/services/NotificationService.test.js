'use strict'
/* global describe, it */
const assert = require('assert')
const _ = require('lodash')

describe('NotificationService', () => {
  let NotificationService
  let Notification
  let User
  let userId, notificationId

  it('should exist', () => {
    assert(global.app.api.services['NotificationService'])
    assert(global.app.services['NotificationService'])
    NotificationService = global.app.services['NotificationService']
    Notification = global.app.models['Notification']
    User = global.app.models['User']
  })
  it('should create a notification', (done) => {
    NotificationService.create({
      type: 'Test',
      text: 'Test Message'
    })
      .then(notification => {
        console.log('THIS NOTIFICATION', notification)
        assert.ok(notification.id)
        assert.ok(notification.token)
        assert.equal(notification.type, 'Test')
        assert.equal(notification.subject, 'Test')
        assert.equal(notification.text, 'Test Message')
        assert.equal(notification.html, '<p>Test Message</p>\n')
        assert.equal(notification.sent, false)

        done()
      })
      .catch(err => {
        console.log('BROKE', err)
        done(err)
      })
  })
  it('should create a notification and send it with no preferences', (done) => {
    User.create({
      email: 'scott@calistyletechnologies.com',
      first_name: 'Scott'
    })
      .then(user => {
        userId = user.id
        assert.ok(user.id)
        return NotificationService.create({
          type: 'Test',
          text: 'Test Message'
        }, [user.id])
      })
      .then(notification => {
        // console.log('THIS NOTIFICATION', notification)
        assert.ok(notification.id)
        assert.ok(notification.token)
        assert.equal(notification.type, 'Test')
        assert.equal(notification.subject, 'Test')
        assert.equal(notification.text, 'Test Message')
        assert.equal(notification.html, '<p>Test Message</p>\n')
        assert.equal(notification.send_email, true)
        assert.equal(notification.sent, true)
        assert.equal(_.isDate(notification.sent_at), true)
        assert.equal(notification.users.length, 1)

        done()
      })
      .catch(err => {
        done(err)
      })
  })
  it('should create a notification and send it with empty preferences', (done) => {
    User.create({
      email: 'scott+1@calistyletechnologies.com',
      first_name: 'Scott',
      preferences: {}
    })
      .then(user => {
        userId = user.id
        assert.ok(user.id)
        return NotificationService.create({
          type: 'Test',
          text: 'Test Message'
        }, [user.id])
      })
      .then(notification => {
        // console.log('THIS NOTIFICATION', notification)
        assert.ok(notification.id)
        assert.ok(notification.token)
        assert.equal(notification.type, 'Test')
        assert.equal(notification.subject, 'Test')
        assert.equal(notification.text, 'Test Message')
        assert.equal(notification.html, '<p>Test Message</p>\n')
        assert.equal(notification.send_email, true)
        assert.equal(notification.sent, true)
        assert.equal(_.isDate(notification.sent_at), true)
        assert.equal(notification.users.length, 1)

        done()
      })
      .catch(err => {
        done(err)
      })
  })
  it('should create a notification and not send email because user has no email', (done) => {
    User.create({
      username: 'scott',
      first_name: 'Scott'
    })
      .then(user => {
        userId = user.id
        assert.ok(user.id)
        return NotificationService.create({
          type: 'Test',
          text: 'Test Message'
        }, [user.id])
      })
      .then(notification => {
        // console.log('THIS NOTIFICATION', notification)
        assert.ok(notification.id)
        assert.ok(notification.token)
        assert.equal(notification.type, 'Test')
        assert.equal(notification.subject, 'Test')
        assert.equal(notification.text, 'Test Message')
        assert.equal(notification.html, '<p>Test Message</p>\n')
        assert.equal(notification.send_email, true)
        assert.equal(notification.sent, false)
        assert.equal(notification.sent_at, null)
        assert.equal(notification.users.length, 1)

        done()
      })
      .catch(err => {
        done(err)
      })
  })
  it('should create a notification and not send email because email false', (done) => {
    User.create({
      email: 'scott+2@calistyletechnologies.com',
      first_name: 'Scott',
      preferences: {
        email: false
      }
    })
      .then(user => {
        userId = user.id
        assert.ok(user.id)
        return NotificationService.create({
          type: 'Test',
          text: 'Test Message'
        }, [user.id])
      })
      .then(notification => {
        // console.log('THIS NOTIFICATION', notification)
        assert.ok(notification.id)
        assert.ok(notification.token)
        assert.equal(notification.type, 'Test')
        assert.equal(notification.subject, 'Test')
        assert.equal(notification.text, 'Test Message')
        assert.equal(notification.html, '<p>Test Message</p>\n')
        assert.equal(notification.send_email, true)
        assert.equal(notification.sent, false)
        assert.equal(notification.sent_at, null)
        assert.equal(notification.users.length, 1)

        done()
      })
      .catch(err => {
        done(err)
      })
  })
  it('should create a notification and not send email because email type false', (done) => {
    User.create({
      email: 'scott+3@calistyletechnologies.com',
      first_name: 'Scott',
      preferences: {
        email: {
          test: false
        }
      }
    })
      .then(user => {
        userId = user.id
        assert.ok(user.id)
        return NotificationService.create({
          type: 'test',
          text: 'Test Message'
        }, [user.id])
      })
      .then(notification => {
        // console.log('THIS NOTIFICATION', notification)
        notificationId = notification.id
        assert.ok(notification.id)
        assert.ok(notification.token)
        assert.equal(notification.type, 'test')
        assert.equal(notification.subject, 'test')
        assert.equal(notification.text, 'Test Message')
        assert.equal(notification.html, '<p>Test Message</p>\n')
        assert.equal(notification.send_email, true)
        assert.equal(notification.sent, false)
        assert.equal(notification.sent_at, null)
        assert.equal(notification.users.length, 1)

        done()
      })
      .catch(err => {
        done(err)
      })
  })
})
