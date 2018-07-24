import { FabrixApp } from '@fabrix/fabrix'
import { FabrixModel as Model } from '@fabrix/fabrix/dist/common'
import { SequelizeResolver } from '@fabrix/spool-sequelize'
import { ModelError } from '@fabrix/spool-sequelize/dist/errors'

import * as shortId from 'shortid'
// shortId.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ')

import { isString, isObject, isNumber, defaultsDeep, values } from 'lodash'
import { NotificationDefaults } from '../utils/queryDefaults'
import { PROTOCOLS } from '../../enums'


export class NotificationResolver extends SequelizeResolver {
  findByIdDefault (id, options = {}) {
    options = this.app.services.SequelizeService.mergeOptionDefaults(
      NotificationDefaults.default(this.app),
      options
    )

    return this.findById(id, options)
  }

  findByTokenDefault (token, options = {}) {
    options = this.app.services.SequelizeService.mergeOptionDefaults(
      NotificationDefaults.default(this.app),
      options,
      {
        where: {
          token: token
        }
      }
    )

    return this.findOne(options)
  }

  findOneDefault (options = {}) {
    options = this.app.services.SequelizeService.mergeOptionDefaults(
      NotificationDefaults.default(this.app),
      options
    )
    return this.findOne(options)
  }

  findAllDefault (options = {}) {
    options = this.app.services.SequelizeService.mergeOptionDefaults(
      NotificationDefaults.default(this.app),
      options
    )

    return this.findAll(options)
  }

  findAndCountDefault (options = {}) {
    options = this.app.services.SequelizeService.mergeOptionDefaults(
      NotificationDefaults.default(this.app),
      options
    )

    return this.findAndCountAll(options)
  }

  createDefault (notification, options: {[key: string]: any} = {}) {
    options = this.app.services.SequelizeService.mergeOptionDefaults(
      NotificationDefaults.default(this.app),
      options
    )

    return this.create(notification, options)
  }

  /**
   * Resolve by instance Function
   * @param notification
   * @param options
   */
  resolveByInstance (notification, options: {[key: string]: any} = {}) {
    return Promise.resolve(notification)
  }
  /**
   * Resolve by id Function
   * @param notification
   * @param options
   */
  resolveById (notification, options: {[key: string]: any} = {}) {
    return this.findById(notification.id, options)
      .then(resNotification => {
        if (!resNotification && options.reject !== false) {
          throw new ModelError('E_NOT_FOUND', `Notification ${notification.id} not found`)
        }
        return resNotification
      })
  }
  /**
   * Resolve by token Function
   * @param notification
   * @param options
   */
  resolveByToken (notification, options: {[key: string]: any} = {}) {
    return this.findOne(defaultsDeep({
      where: {
        token: notification.token
      }
    }, options))
      .then(resNotification => {
        if (!resNotification && options.reject !== false) {
          throw new ModelError('E_NOT_FOUND', `Notification token ${notification.token} not found`)
        }
        return resNotification
      })
  }
  /**
   * Resolve by number Function
   * @param notification
   * @param options
   */
  resolveByNumber (notification, options: {[key: string]: any} = {}) {
    return this.findById(notification, options)
      .then(resNotification => {
        if (!resNotification && options.reject !== false) {
          throw new ModelError('E_NOT_FOUND', `Notification ${notification.token} not found`)
        }
        return resNotification
      })
  }
  /**
   * Resolve by string Function
   * @param notification
   * @param options
   */
  resolveByString (notification, options: {[key: string]: any} = {}) {
    return this.findOne(defaultsDeep({
      where: {
        token: notification
      }
    }, options))
      .then(resNotification => {
        if (!resNotification && options.reject !== false) {
          throw new ModelError('E_NOT_FOUND', `Notification ${notification} not found`)
        }
        return resNotification
      })
  }
  /**
   * Primary Resolve Function
   * @param notification
   * @param options
   */
  resolve(notification, options: {[key: string]: any} = {}) {
    const resolvers = {
      'instance': notification instanceof this.sequelizeModel,
      'id': !!(notification && isObject(notification) && notification.id),
      'token': !!(notification && isObject(notification) && notification.token),
      'number': !!(notification && isNumber(notification)),
      'string': !!(notification && isString(notification))
    }
    const type = Object.keys(resolvers).find((key) => resolvers[key])

    switch (type) {
      case 'instance': {
        return this.resolveByInstance(notification, options)
      }
      case 'id': {
        return this.resolveById(notification, options)
      }
      case 'token': {
        return this.resolveByToken(notification, options)
      }
      case 'number': {
        return this.resolveByNumber(notification, options)
      }
      case 'string': {
        return this.resolveByString(notification, options)
      }
      default: {
        // TODO create proper error
        const err = new Error(`Unable to resolve Notification ${notification}`)
        return Promise.reject(err)
      }
    }
  }
}

export interface Notification {
  setSent(app: FabrixApp, options): any
  send(app: FabrixApp, options): any
  click(app: FabrixApp, user, options): any
  open(app: FabrixApp, user, options): any
  userOpened(app: FabrixApp, user, options): any
  resolveUsers(app: FabrixApp, options): any
  resolveEmailUsers(app: FabrixApp, options): any
}


/**
 * @module Notification
 * @description Notification
 */
export class Notification extends Model {

  public static config (app, Sequelize) {
    return {
      options: {
        underscored: true,
        enums: {
          PROTOCOLS: PROTOCOLS
        },
        hooks: {
          beforeCreate: (notification, options) => {
            if (!notification.token) {
              notification.token = `notification_${shortId.generate()}`
            }
            if (!notification.subject) {
              notification.subject = notification.type
            }
            if (!notification.html) {
              notification.html = app.services.RenderGenericService.renderSync(notification.text).document
            }
          },
          afterCreate: (notification, options) => {
            return app.services.NotificationService.afterCreate(notification, options)
          }
        },
        classMethods: {


        }
      }
    }
  }

  public static schema (app, Sequelize) {
    return {
      // Unique identifier for a particular notification.
      token: {
        type: Sequelize.STRING,
        unique: true
      },
      // Protocol to send email
      protocol: {
        type: Sequelize.ENUM,
        values: values(PROTOCOLS),
        defaultValue: app.config.get('generics.email_provider.config.protocol')
      },
      // Host to send email from
      host: {
        type: Sequelize.STRING,
        defaultValue: app.config.get('generics.email_provider.config.host')
      },
      // Reply to value
      reply_to: {
        type: Sequelize.STRING,
        defaultValue: app.config.get('generics.email_provider.config.reply_to')
      },
      // The type of notification in dot notation
      type: {
        type: Sequelize.STRING,
        allowNull: false
      },
      // The subject of the notification and email
      subject: {
        type: Sequelize.STRING
      },
      // The email template name for GenericEmailProvider
      template_name: {
        type: Sequelize.STRING
      },
      // Content for email template for GenericEmailProvider
      template_content: {
        type: Sequelize.JSONB,
        defaultValue: {}
      },
      // Text version of the notification
      text: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      // Html version of the notification
      html: {
        type: Sequelize.TEXT
      },
      total_opens: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      total_clicks: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      // If an email copy of the notification should be sent
      send_email: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      // If the email has been sent
      sent: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      // When the email was sent
      sent_at: {
        type: Sequelize.DATE
      }
    }
  }

  public static get resolver() {
    return NotificationResolver
  }

  public static associate (models) {
    models.Notification.belongsToMany(models.User, {
      as: 'users',
      through: {
        model: models.ItemNotification,
        unique: false,
        scope: {
          model: 'user'
        }
      },
      foreignKey: 'notification_id',
      constraints: false
    })
  }
}

/**
 *
 */
Notification.prototype.setSent = function(app: FabrixApp) {
  this.sent = true
  this.sent_at = new Date(Date.now())
  return this
}
/**
 *
 */
Notification.prototype.send = function(app: FabrixApp, options = {}) {
  const sendType = this.template_name && this.template_name !== '' ? 'sendTemplate' : 'send'

  if (typeof this.send_email !== 'undefined' && this.send_email === false) {
    return Promise.resolve(this)
  }

  return this.resolveEmailUsers(app, {transaction: options.transaction || null})
    .then(emailUsers => {
      if (emailUsers && emailUsers.length > 0) {
        const _emailUsers = this.users.filter(user => user.email)
        const users = _emailUsers.map(user => {
          if (user) {
            return {
              email: user.email,
              name: user.first_name || user.username || app.config.get('notifications.to.default_name')
            }
          }
        })
        const message = {
          protocol: this.protocol,
          host: this.host,
          subject: this.subject,
          text: this.text,
          html: this.html,
          to: users,
          reply_to: this.reply_to || app.config.get('notifications.from.email'),
          from: {
            email: app.config.get('notifications.from.email'),
            name: app.config.get('notifications.from.name')
          },
          template_name: this.template_name,
          template_content: this.template_content
        }
        return app.services.EmailGenericService[sendType](message)
          .catch(err => {
            app.log.error(err)
            return null
          })

      }
      else {
        return []
      }
    })
    .then(emails => {
      // emails = emails.filter(email => email)
      if (emails.length > 0) {
        app.log.debug('EMAILS SENT', this.token, emails.length)
        return this.setSent(app, options).save({ transaction: options.transaction || null})
      }
      else {
        return this
      }
    })
}
/**
 *
 */
Notification.prototype.click = function(app: FabrixApp, user, options = {}) {
  this.total_clicks++
  return Promise.resolve(this)
}
/**
 *
 */
Notification.prototype.open = function(app: FabrixApp, user, options = {}) {
  this.total_opens++
  if (!user) {
    return Promise.resolve(this)
  }
  else {
    return this.userOpened(app, user, options)
  }
}
/**
 * Register that a User Opened a Notification
 */
Notification.prototype.userOpened = function (app: FabrixApp, user, options = {}) {
  return app.models['ItemNotification'].update({ opened: true }, {
    where: {
      notification_id: this.id,
      model: 'user',
      model_id: user.id
    },
    transaction: options.transaction || null
  })
    .then(() => {
      return this
    })
    .catch(err => {
      app.log.error(err)
      return this
    })
}
/**
 *
 */
Notification.prototype.resolveUsers = function(app, options = {}) {
  if (
    this.users
    && this.users.length > 0
    && this.users.every(u => u instanceof app.models['User'].resolver.sequelizeModel)
    && options.reload !== true
  ) {
    return Promise.resolve(this)
  }
  else {
    return this.getUsers({transaction: options.transaction || null})
      .then(_users => {
        _users = _users || []
        this.users = _users
        this.setDataValue('users', _users)
        this.set('users', _users)
        return this
      })
  }
}
/**
 *
 */
// TODO, refactor to something pleasant.
Notification.prototype.resolveEmailUsers = function(app: FabrixApp, options = {}) {
  let emailUsers = []
  return this.resolveUsers(app, {
    transaction: options.transaction || null,
    reload: options.reload || null
  })
    .then(() => {
      if (this.users && this.users.length > 0) {
        // List of eligible users
        emailUsers = this.users.map(user => {
          let send = true

          // If user has no email
          if (typeof user.email === 'undefined' || !user.email) {
            send = false
            // return
          }

          // Migration Insurance
          if (!user.preferences) {
            user.preferences = {}
          }

          if (typeof user.preferences === 'string') {
            try {
              user.preferences = JSON.parse(user.preferences)
            }
            catch (err) {
              app.log.error('Unable to parse user.preferences')
              user.preferences = {}
            }
          }
          if (user.preferences.email === false) {
            send = false
          }
          if (user.preferences.email === 'undefined') {
            user.preferences.email = {}
          }

          // console.log('BROKE', typeof user.preferences, user.preferences)
          // user.preferences = user.preferences || {}
          // user.preferences.email = typeof user.preferences.email !== 'undefined' ?
          //   user.preferences.email : {}

          // If user's email preferences are all false
          if (
            typeof user.preferences.email !== 'undefined'
            && user.preferences.email === false
          ) {
            send = false
          }
          // If user doesn't want this type of email
          else if (
            typeof user.preferences.email !== 'undefined'
            && user.preferences.email[this.type] === false
          ) {
            send = false
          }

          return send === true
        })
      }
      // Remove empty values in the mapped array
      emailUsers = emailUsers.filter(n => n)

      return emailUsers
    })
    .catch(err => {
      app.log.error(err)
      return emailUsers
    })
}
