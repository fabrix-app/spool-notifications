/**
 * Spool Configuration
 *
 * @see {@link https://fabrix.app/docs/spool/config
 */
export const spool = {
  type: 'misc',

  /**
   * API and config resources provided by this Spool.
   */
  provides: {
    resources: ['models', 'controllers', 'services'],
    api: {
      controllers: ['NotificationsController'],
      services: ['NotificationService'],
      models: ['User', 'Notification', 'ItemNotification']
    },
    config: ['notifications', 'routes']
  },
  /**
   * Configure the lifecycle of this pack; that is, how it boots up, and which
   * order it loads relative to other spools.
   */
  lifecycle: {
    configure: {
      /**
       * List of events that must be fired before the configure lifecycle
       * method is invoked on this Spool
       */
      listen: [
        'spool:sequelize:configured',
        'spool:generics:configured',
        'spool:permissions:configured'
      ],

      /**
       * List of events emitted by the configure lifecycle method
       */
      emit: [
        'spool:notifications:configured'
      ]
    },
    initialize: {
      listen: [
        'spool:sequelize:initialized',
        'spool:permissions:initialized',
        'spool:generics:initialized'
      ],
      emit: [
        'spool:notifications:initialized'
      ]
    }
  }
}

