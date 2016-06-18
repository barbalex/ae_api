'use strict'

const logout = require('../../handlers/users/logout.js')

module.exports = {
  method: `GET`,
  path: `/users/logout`,
  handler: logout
}
