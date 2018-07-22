import * as joi from 'joi'

export const notificationsConfig = joi.object().keys({
  prefix: joi.string().accept('', null).required(),
  to: joi.object().keys({
    default_name: joi.string()
  }),
  from: joi.object().keys({
    name: joi.string(),
    email: joi.string()
  })
})
