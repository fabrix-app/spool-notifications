import { FabrixApp } from '@fabrix/fabrix'
import * as _ from 'lodash'

export const Notifications = {
  /**
   * configure
   * @param app
   */
  configure: (app: FabrixApp) => {
    return Promise.resolve()
  },
  /**
   * copyDefaults - Copies the default configuration so that it can be restored later
   * @param app
   * @returns {Promise.<{}>}
   */
  copyDefaults: (app: FabrixApp) => {
    app.config.set('notificationsDefaults', _.clone(app.config.get('notifications')))
    return Promise.resolve({})
  },
  /**
   * resolveGenerics - adds default generics if missing from configuration
   * @param app
   * @returns {Promise.<{}>}
   */
  resolveGenerics: (app: FabrixApp) => {
    if (!app.config.get('generics')) {
      app.config.set('generics', {})
    }
    if (!app.config.get('generics.render_service')) {
      app.config.set('generics.render_service', {
        adapter: require('@fabrix/generics-render'),
        config: {
          // Must always be set to true
          html: true
        },
        plugins: [
          // Example Plugin (markdown-it-meta is required and already installed)
          // {
          //   plugin: require('markdown-it-meta'),
          //   options: {}
          // }
        ]
      })
    }
    return Promise.resolve({})
  }
}
