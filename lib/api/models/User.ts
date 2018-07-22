import { FabrixModel as Model } from '@fabrix/fabrix/dist/common'



export class User extends Model {
  public static config(app, Sequelize) {
    return {
      options: {
        underscored: true
      }
    }
  }
  public static schema(app, Sequelize) {
    return {}
  }

  // If you need associations, put them here
  // More information about associations here: http://docs.sequelizejs.com/en/latest/docs/associations/
  public static associate (models) {
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
