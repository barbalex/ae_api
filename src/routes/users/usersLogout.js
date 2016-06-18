'use strict'

const logout = require('../../handlers/usersLogout.js')

module.exports = {
  method: `GET`,
  path: `/users/logout`,
  handler: logout
}
