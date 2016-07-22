'use strict'

const nodes = require('../../handlers/nodes/nodes.js')

module.exports = {
  method: `GET`,
  path: `/nodes`,
  handler: nodes,
  config: {
    auth: false,
  }
}
