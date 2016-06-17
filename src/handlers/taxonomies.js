'use strict'

const Boom = require(`boom`)
const getTaxonomies = require(`../getTaxonomies.js`)

module.exports = (request, callback) => {
  getTaxonomies()
    .then((taxonomies) => {
      if (taxonomies && taxonomies.length) {
        return callback(null, taxonomies)
      }
      throw `no taxonomies received`  /* eslint no-throw-literal:0 */
    })
    .catch((error) =>
      callback(Boom.badImplementation(error), null)
    )
}
