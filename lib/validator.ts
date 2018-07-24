import * as joi from 'joi'
import { notificationsConfig } from './schemas/notificationsConfig'

export const Validator = {
  // Validate Notifications
  validateNotifications: {
    config(config) {
      return new Promise((resolve, reject) => {
        joi.validate(config, notificationsConfig, (err, value) => {
          if (err) {
            return reject(new TypeError('config.notifications: ' + err))
          }
          return resolve(value)
        })
      })
    }
  }
}
