import { FabrixModel as Model } from '@fabrix/fabrix/dist/common'

/**
 * @module ItemNotification
 * @description Item Notification
 */
export class ItemNotification extends Model {

  public static config (app, Sequelize) {
    return {
      options: {
        underscored: true
      }
    }
  }

  public static schema (app, Sequelize) {
    return {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      notification_id: {
        type: Sequelize.INTEGER,
        unique: 'notification_model'
      },
      model: {
        type: Sequelize.STRING,
        unique: 'notification_model'
      },
      model_id: {
        type: Sequelize.INTEGER,
        unique: 'notification_model',
        references: null
      },
      opened: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      }
    }
  }

  /**
   * Associate the Model
   * @param models
   */
  public static associate (models) {
    models.ItemNotification.belongsTo(models.Notification, {
      foreignKey: 'notification_id'
    })
  }
}
