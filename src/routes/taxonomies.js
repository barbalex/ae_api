'use strict'

const taxonomies = require('../handlers/taxonomies.js')

module.exports = {
  method: `GET`,
  path: `/taxonomies`,
  handler: taxonomies,
  config: {
    auth: false
  }
}
