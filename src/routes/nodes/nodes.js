'use strict'

/**
 * test with:
 * correct: http://localhost:8000/nodes
 */

const nodes = require('../../handlers/nodes/nodes.js')

module.exports = {
  method: `GET`,
  path: `/nodes`,
  handler: nodes,
  config: {
    auth: false,
  }
}
