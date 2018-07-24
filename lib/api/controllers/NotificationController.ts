import { FabrixController as Controller } from '@fabrix/fabrix/dist/common'
import { ModelError } from '@fabrix/spool-sequelize/dist/errors'

/**
 * @module NotificationController
 * @description Controller for Notifications
 */
export class NotificationController extends Controller {
  /**
   * Find notification by id
   * @param req
   * @param res
   */
  findById(req, res) {
    const orm = this.app.models
    const Notification = orm['Notification']

    if (!req.params.id) {
      const err = new Error('Notification missing identifier')
      return res.serverError(err)
    }

    Notification.findByIdDefault(req.params.id, {})
      .then(notification => {
        if (!notification) {
          throw new ModelError('E_NOT_FOUND', `Notification id ${ req.params.id } not found`)
        }
        return this.app.services.PermissionsService.sanitizeResult(req, notification)
      })
      .then(result => {
        return res.json(result)
      })
      .catch(err => {
        return res.serverError(err)
      })
  }

  /**
   * Finds notification by token
   * @param req
   * @param res
   */
  findByToken(req, res) {
    const orm = this.app.models
    const Notification = orm['Notification']

    if (!req.params.token) {
      const err = new Error('Notification missing identifier')
      return res.serverError(err)
    }

    Notification.findByTokenDefault(req.params.token)
      .then(notification => {
        if (!notification) {
          throw new ModelError('E_NOT_FOUND', `Notification token ${ req.params.token } not found`)
        }
        return this.app.services.PermissionsService.sanitizeResult(req, notification)
      })
      .then(result => {
        return res.json(result)
      })
      .catch(err => {
        return res.serverError(err)
      })
  }

  /**
   * Resolves either a notification id or a token
   * @param req
   * @param res
   */
  resolve(req, res) {
    const orm = this.app.models
    const Notification = orm['Notification']

    if (!req.params.notification) {
      const err = new Error('Notification missing identifier')
      return res.serverError(err)
    }

    Notification.resolve(req.params.notification)
      .then(notification => {
        if (!notification) {
          throw new ModelError('E_NOT_FOUND', `Notification ${ req.params.notification } not found`)
        }
        return this.app.services.PermissionsService.sanitizeResult(req, notification)
      })
      .then(result => {
        return res.json(result)
      })
      .catch(err => {
        return res.serverError(err)
      })
  }

  /**
   *
   * @param req
   * @param res
   */
  findAll(req, res) {
    const orm = this.app.models
    const Notification = orm['Notification']
    const limit = Math.max(0, req.query.limit || 10)
    const offset = Math.max(0, req.query.offset || 0)
    const sort = req.query.sort || [['created_at', 'DESC']]
    const where = req.jsonCriteria(req.query.where)

    Notification.findAndCountDefault({
      where: where,
      order: sort,
      offset: offset,
      limit: limit
    })
      .then(notifications => {
        // Paginate
        res.paginate(notifications.count, limit, offset, sort)
        return this.app.services.PermissionsService.sanitizeResult(req, notifications.rows)
      })
      .then(result => {
        return res.json(result)
      })
      .catch(err => {
        return res.serverError(err)
      })
  }

  /**
   * Get User's notifications
   * @param req
   * @param res
   */
  userNotifications(req, res) {
    const Notification = this.app.models['Notification']
    const limit = Math.max(0, req.query.limit || 10)
    const offset = Math.max(0, req.query.offset || 0)
    const sort = req.query.sort || [['created_at', 'DESC']]
    // const where = req.jsonCritera(req.query.where)

    if (!req.user && !req.params.id) {
      const err = new Error('A user in session is required')
      return res.status(401).send(err)
    }

    let id = req.params.id
    if (!id && req.user) {
      id = req.user.id
    }

    if (!id) {
      const err = new Error('A user in session or an id is required')
      return res.status(401).send(err)
    }
    Notification.findAndCountDefault({
      include: [
        {
          model: this.app.models['User'].resolver.sequelizeModel,
          as: 'users',
          where: {
            id: id
          }
        }
      ],
      order: sort,
      offset: offset,
      // limit: limit
    })
      .then(notifications => {
        // Paginate
        res.paginate(notifications.count, limit, offset, sort)
        return this.app.services.PermissionsService.sanitizeResult(req, notifications.rows)
      })
      .then(result => {
        return res.json(result)
      })
      .catch(err => {
        return res.serverError(err)
      })
  }

  /**
   * Register that a user remotely opened a notification
   * @param req
   * @param res
   */
  registerOpen(req, res) {
    const NotificationService = this.app.services.NotificationService
    const user = req.params.id
    if (!req.params.notification) {
      const err = new Error('Notification missing identifier')
      return res.serverError(err)
    }

    // Monkey patch the request user if the param is present.
    if (user) {
      req.user = user
    }

    NotificationService.registerOpen(req.params.notification, {req: req})
      .then(result => {
        return res.json(result)
      })
      .catch(err => {
        return res.serverError(err)
      })
  }
  /**
   * Register that a user remotely clicked a notification
   * @param req
   * @param res
   */
  registerClick(req, res) {
    const NotificationService = this.app.services.NotificationService
    const user = req.params.id
    if (!req.params.notification) {
      const err = new Error('Notification missing identifier')
      return res.serverError(err)
    }

    // Monkey patch the request user if the param is present.
    if (user) {
      req.user = user
    }

    NotificationService.registerClick(req.params.notification, {req: req})
      .then(result => {
        return res.json(result)
      })
      .catch(err => {
        return res.serverError(err)
      })
  }
}

