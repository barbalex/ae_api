'use strict'

const Boom = require('boom')
const getNodesCategories = require('../../getNodesCategories.js')

module.exports = (request, reply) => {
  getNodesCategories()
    .then((categoryNodes) =>
      reply(null, categoryNodes)
    )
    .catch((error) =>
      reply(Boom.badImplementation(error), null)
    )
}
