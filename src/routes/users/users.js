'use strict'

const users = require('../../handlers/users/users.js')

module.exports = {
  method: `GET`,
  path: `/users`,
  handler: users,
  config: {
    auth: {
      strategy: `session`,
      scope: [`admin`]
    },
    plugins: {
      lout: false
    }
  }
}
