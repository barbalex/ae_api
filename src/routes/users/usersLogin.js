'use strict'

const Joi = require('joi')
const login = require('../../handlers/usersLogin.js')

module.exports = {
  method: `POST`,
  path: `/users/login`,
  handler: login,
  config: {
    validate: {
      payload: {
        name: Joi.string().min(2).max(200).required(),
        password: Joi.string().min(2).max(200).required()
      }
    }
  }
}
