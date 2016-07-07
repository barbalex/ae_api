'use strict'

const object = require('../../handlers/export/object.js')

module.exports = {
  method: `GET`,
  path: `/export/object`,
  handler: object,
  config: {
    auth: false
  }
}
