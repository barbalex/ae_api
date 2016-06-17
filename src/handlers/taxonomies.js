'use strict'

const Boom = require(`boom`)
const getTaxonomies = require(`../getTaxonomies.js`)

module.exports = (request, reply) => {
  getTaxonomies()
    .then((taxonomies) => {
      if (taxonomies && taxonomies.length) {
        return reply(null, taxonomies)
      }
      throw `no taxonomies received`  /* eslint no-throw-literal:0 */
    })
    .catch((error) =>
      reply(Boom.badImplementation(error), null)
    )
}
