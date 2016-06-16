'use strict'

const taxonomies = require(`../../queries/taxonomies.js`)

module.exports = {
  method: `GET`,
  path: `/taxonomies`,
  handler: taxonomies
}
