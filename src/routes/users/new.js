'use strict'

const Joi = require('joi')
const verifyUniqueUser = require('../../verifyUniqueUser.js')
const newUser = require('../../handlers/users/new.js')

module.exports = {
  method: `POST`,
  path: `/users`,
  handler: newUser,
  config: {
    pre: [
      { method: verifyUniqueUser }
    ],
    validate: {
      payload: {
        name: Joi.string().min(2).max(200).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(2).max(200).required()
      }
    }
  }
}
