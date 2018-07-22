export const NotificationDefaults = {
  default: (app) => {
    return {
      include: [
        {
          model: app.models['User'].resolver.sequelizeModel,
          as: 'users',
          duplicating: false
        }
      ]
    }
  }
}
