'use strict'

const logout = require('../handlers/usersLogout.js')

module.exports = {
  method: `GET`,
  path: `/users`,
  handler: logout,
  config: {
    auth: {
      strategy: `cookie`,
      scope: [`admin`]
    }
  }
}
