import { FabrixModel as Model } from '@fabrix/fabrix/dist/common'
import { User as PermissionsUser } from '@fabrix/spool-permissions/dist/api/models/User'


export class User extends PermissionsUser {
  // If you need associations, put them here
  // More information about associations here: http://docs.sequelizejs.com/en/latest/docs/associations/
  public static associate (models) {
    PermissionsUser.associate(models)
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
