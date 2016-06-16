'use strict'

const getTaxonomies = require(`../src/getTaxonomies.js`)

module.exports = (request, callback) => {
  getTaxonomies()
    .then((taxonomies) => {
      if (taxonomies && taxonomies.length) {
        return callback(null, taxonomies)
      }
      callback(`no taxonomies received`)
    })
    .catch((error) => callback(error, null))
}
