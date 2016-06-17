'use strict'

const logout = require('../handlers/logout.js')

module.exports = {
  method: `GET`,
  path: `/logout`,
  handler: logout
}
