import * as joi from 'joi'
import { notificationsConfig } from './schemas/notificationsConfig'

export const Validator = {
  // Validate Proxy Cart
  validateNotifications: {
    config(config) {
      return new Promise((resolve, reject) => {
        joi.validate(config, notificationsConfig, (err, value) => {
          if (err) {
            return reject(new TypeError('config.proxyNotifications: ' + err))
          }
          return resolve(value)
        })
      })
    }
  }
}
