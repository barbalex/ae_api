'use strict'

const Boom = require('boom')
const getCategories = require('../../getCategories.js')

module.exports = (request, reply) => {
  getCategories()
    .then((categories) => {
      const nodes = categories.map((c) => ({
        id: c.name,
        name: c.name,
        parent_id: null,
      }))
      reply(null, nodes)
    })
    .catch((error) =>
      reply(Boom.badImplementation(error), null)
    )
}
