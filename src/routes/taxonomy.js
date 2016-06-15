'use strict'

const taxonomy = require(`../../queries/taxonomy.js`)

module.exports = {
  method: `GET`,
  path: `/taxonomy`,
  handler: taxonomy
}
