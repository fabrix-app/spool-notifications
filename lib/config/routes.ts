import * as joi from 'joi'

export const routes = {
  // Notifications
  '/notifications': {
    'GET': 'NotificationController.findAll',
    config: {
      prefix: 'notifications.prefix',
      validate: {
        query: {
          offset: joi.number(),
          limit: joi.number(),
          sort: joi.array().items(joi.array()),
          where: joi.any()
        }
      },
      app: {
        permissions: {
          resource_name: 'apiGetNotificationsRoute',
          roles: ['admin']
        }
      }
    }
  },
  '/notification/:id': {
    'GET': 'NotificationController.findById',
    config: {
      prefix: 'notifications.prefix',
      validate: {
        params: {
          id: joi.alternatives().try(
            joi.number(),
            joi.string()
          ).required()
        }
      },
      app: {
        permissions: {
          resource_name: 'apiGetNotificationIdRoute',
          roles: ['admin']
        }
      }
    }
  },
  '/notification/token/:token': {
    'GET': 'NotificationController.findByToken',
    config: {
      prefix: 'notifications.prefix',
      validate: {
        params: {
          token: joi.string().required()
        }
      },
      app: {
        permissions: {
          resource_name: 'apiGetNotificationTokenTokenRoute',
          roles: ['admin', 'registered']
        }
      }
    }
  },
  '/user/notifications': {
    'GET': 'NotificationController.userNotifications',
    config: {
      prefix: 'notifications.prefix',
      validate: {
        query: {
          offset: joi.number(),
          limit: joi.number(),
          sort: joi.array().items(joi.array()),
          where: joi.any()
        }
      },
      app: {
        permissions: {
          resource_name: 'apiGetUserNotificationsRoute',
          roles: ['registered', 'admin']
        }
      }
    }
  },
  '/user/notification/:notification': {
    'GET': 'NotificationController.resolve',
    config: {
      prefix: 'notifications.prefix',
      validate: {
        params: {
          notification: joi.alternatives().try(
            joi.number(),
            joi.string()
          ).required()
        }
      },
      app: {
        permissions: {
          resource_name: 'apiGetUserNotificationsIdRoute',
          roles: ['registered', 'admin']
        }
      }
    }
  },
  '/user/notification/:notification/click': {
    'GET': 'NotificationController.registerClick',
    config: {
      prefix: 'notifications.prefix',
      validate: {
        params: {
          notification: joi.alternatives().try(
            joi.number(),
            joi.string()
          ).required()
        }
      },
      app: {
        permissions: {
          resource_name: 'apiGetUserNotificationNotificationClickRoute',
          roles: ['registered', 'admin']
        }
      }
    }
  },
  '/user/notification/:notification/open': {
    'GET': 'NotificationController.registerOpen',
    config: {
      prefix: 'notifications.prefix',
      validate: {
        params: {
          notification: joi.alternatives().try(
            joi.number(),
            joi.string()
          ).required()
        }
      },
      app: {
        permissions: {
          resource_name: 'apiGetUserNotificationNotificationOpenRoute',
          roles: ['registered', 'admin']
        }
      }
    }
  },
  '/user/:id/notifications': {
    'GET': 'NotificationController.userNotifications',
    config: {
      prefix: 'notifications.prefix',
      validate: {
        params: {
          id: joi.alternatives().try(
            joi.number(),
            joi.string()
          ).required()
        },
        query: {
          offset: joi.number(),
          limit: joi.number(),
          sort: joi.array().items(joi.array()),
          where: joi.any()
        }
      },
      app: {
        permissions: {
          resource_name: 'apiGetUserIdNotificationsRoute',
          roles: ['admin']
        }
      }
    }
  },
  '/user/:id/notifications/:notification': {
    'GET': 'NotificationController.resolve',
    config: {
      prefix: 'notifications.prefix',
      validate: {
        params: {
          id: joi.alternatives().try(
            joi.number(),
            joi.string()
          ).required(),
          notification: joi.alternatives().try(
            joi.number(),
            joi.string()
          ).required()
        },
      },
      app: {
        permissions: {
          resource_name: 'apiGetUserIdNotificationsNotificationRoute',
          roles: ['admin']
        }
      }
    }
  }
}
