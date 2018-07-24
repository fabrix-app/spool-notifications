import { FabrixApp } from '@fabrix/fabrix'
import { RenderGeneric } from '@fabrix/generics-render'
import { clone } from 'lodash'

export const Notifications = {
  /**
   * copyDefaults - Copies the default configuration so that it can be restored later
   * @param app
   * @returns {Promise.<{}>}
   */
  copyDefaults: (app: FabrixApp) => {
    app.config.set('notificationsDefaults', clone(app.config.get('notifications')))
    return Promise.resolve({})
  },
  /**
   * resolveGenerics - adds default generics if missing from configuration
   * @param app
   * @returns {Promise.<{}>}
   */
  resolveGenerics: (app: FabrixApp) => {
    if (!app.config.get('generics.render_service.adapter')) {
      app.config.set('generics.render_service', {
        adapter: RenderGeneric,
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
