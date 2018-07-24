import { Spool } from '@fabrix/fabrix/dist/common'

import { Notifications } from './notifications'
import { Validator  } from './validator'

import * as config from './config/index'
import * as pkg from '../package.json'
import * as api from './api/index'

export class NotificationsSpool extends Spool {

  constructor(app) {
    super(app, {
      config: config,
      pkg: pkg,
      api: api
    })
  }

  /**
   * Validates Configs
   */
  async validate () {
    const requiredSpools = ['express', 'sequelize', 'passport', 'permissions']
    const spools = Object.keys(this.app.spools)

    if (!spools.some(v => requiredSpools.indexOf(v) >= 0)) {
      return Promise.reject(new Error(`spool-notifications requires spools: ${ requiredSpools.join(', ') }!`))
    }

    // Configs
    if (!this.app.config.get('notifications')) {
      return Promise.reject(new Error('No configuration found at config.notifications!'))
    }

    if (!this.app.config.get('generics')) {
      return Promise.reject(new Error('No configuration found at config.generics!'))
    }

    if (!this.app.config.get('generics.email_provider')) {
      return Promise.reject(new Error('No configuration found at config.generics.email_provider!'))
    }
    if (!this.app.config.get('generics.email_provider.config')) {
      return Promise.reject(new Error('No configuration found at config.generics.email_provider.config!'))
    }
    if (!this.app.config.get('generics.email_provider.config.protocol')) {
      return Promise.reject(new Error('No configuration found at config.generics.email_provider.config.protocol!'))
    }
    if (!this.app.config.get('generics.email_provider.config.host')) {
      return Promise.reject(new Error('No configuration found at config.generics.email_provider.options.host!'))
    }

    if (!this.app.config.get('generics.render_service')) {
      this.app.log.warn('config.generics.render_service is not set, notifications will load generics-render')
    }

    return Promise.all([
      Validator.validateNotifications.config(this.app.config.get('notifications'))
    ])
  }

  async configure () {
    return Promise.all([
      Notifications.resolveGenerics(this.app)
    ])
  }

  sanity() {
    if (!this.app.config.get('generics.render_service.adapter')) {
      throw new Error('config.generics.render_service was not set or was unset incorrectly')
    }
  }
}

