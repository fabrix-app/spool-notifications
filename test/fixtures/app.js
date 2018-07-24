'use strict'

const _ = require('lodash')
const smokesignals = require('smokesignals')
const fs = require('fs')
const path = require('path')
const ModelPassport = require('@fabrix/spool-passport/dist/api/models/User').User
const ModelPermissions = require('@fabrix/spool-permissions/dist/api/models/User').User
const SequelizeResolver = require('@fabrix/spool-permissions/dist/api/models/User').UserResolver

const SERVER = process.env.SERVER || 'express'
const ORM = process.env.ORM || 'sequelize'
const DIALECT = process.env.DIALECT || 'postgres'

const spools = [
  require('@fabrix/spool-router').RouterSpool,
  // require('@fabrix/spool-engine').EngineSpool,
  require('@fabrix/spool-passport').PassportSpool,
  require('@fabrix/spool-permissions').PermissionsSpool,
  require('@fabrix/spool-generics').GenericsSpool,
  require('../../dist').NotificationsSpool // spool-notifications
]

let web = {}

const stores = {
  sqlitedev: {
    adapter: require('sails-disk')
  },
  uploads: {
    database: 'Sequelize',
    storage: './test/test.uploads.sqlite',
    host: '127.0.0.1',
    dialect: 'sqlite'
  }
}

if (ORM === 'waterline') {
  spools.push(require('@fabrix/spool-waterline').SpoolWaterline)
}
else if (ORM === 'sequelize') {
  spools.push(require('@fabrix/spool-sequelize').SequelizeSpool)
  if (DIALECT === 'postgres') {
    stores.sqlitedev = {
      orm: 'sequelize',
      database: 'Sequelize',
      host: '127.0.0.1',
      dialect: 'postgres',
      migrate: 'drop'
    }
  }
  else {
    stores.sqlitedev = {
      database: 'Sequelize',
      storage: './test/test.sqlite',
      host: '127.0.0.1',
      dialect: 'sqlite'
    }
  }
}

if ( SERVER === 'express' ) {
  spools.push(require('@fabrix/spool-express').ExpressSpool)
  web = {
    express: require('express'),
    middlewares: {
      order: [
        'static',
        'addMethods',
        'cookieParser',
        'session',
        'bodyParser',
        'passportInit',
        'passportSession',
        'methodOverride',
        'router',
        'www',
        '404',
        '500'
      ],
      static: require('express').static('test/static')
    }
  }
}

const App = {
  api: {
    models: {
      User: class User extends ModelPermissions {
        static associate(models) {
          ModelPermissions.associate(models)
          models.User.belongsToMany(models.Notification, {
            as: 'notifications',
            through: {
              model: models.ItemNotification,
              unique: false,
              scope: {
                model: 'user'
              }
            },
            foreignKey: 'model_id',
            constraints: false
          })
        }
      }
    }
  },
  pkg: {
    name: 'spool-notifications-test',
    version: '1.0.0'
  },
  config: {
    stores: stores,
    models: {
      defaultStore: 'sqlitedev',
      migrate: 'drop'
    },
    main: {
      spools: spools
    },
    policies: {
      '*': {
        '*': [ 'CheckPermissions.checkRoute' ]
      }
    },
    log: {
      logger: new smokesignals.Logger('debug')
    },
    web: web,
    session: {
      secret: 'notifications'
    },
    notifications: {
      to: {
        // The default name to use if the user has no specified name
        default_name: 'Valued Customer'
      },
      from: {
        // The email to send this notification from
        email: 'test.com',
        // The name of the email sending this notification
        name: 'Test'
      }
    },
    passport: {
      strategies: {
        local: {
          strategy: require('passport-local').Strategy
        }
      }
    },
    permissions: {
      defaultRole: 'public',
      defaultRegisteredRole: 'registered',
      modelsAsResources: true,
      fixtures: {
        roles: [{
          name: 'admin',
          public_name: 'Admin'
        }, {
          name: 'registered' ,
          public_name: 'Registered'
        }, {
          name: 'public' ,
          public_name: 'Public'
        }],
        permissions: []
      },
      defaultAdminUsername: 'admin',
      defaultAdminPassword: 'admin1234'
    },
    // Generics
    generics: {
      email_provider: {
        adapter: require('./FakeEmail'),
        config: {
          host: 'test.com',
          protocol: 'https'
        }
      }
    },
    engine: {
      live_mode: false,
      profile: 'testProfile'
    }
  }
}

const dbPath = path.resolve(__dirname, './test.sqlite')
if (fs.existsSync(dbPath)) {
  fs.unlinkSync(dbPath)
}

const uploadPath = path.resolve(__dirname, './test.uploads.sqlite')
if (fs.existsSync(uploadPath)) {
  fs.unlinkSync(uploadPath)
}

_.defaultsDeep(App, smokesignals.FailsafeConfig)
module.exports = App
