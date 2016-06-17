'use strict'

const login = require(`../handlers/login.js`)

module.exports = {
  method: `POST`,
  path: `/login`,
  handler: login
}
