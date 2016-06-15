'use strict'

const objectById = require(`../../queries/objectById.js`)

module.exports = {
  method: `GET`,
  path: `/object/{id}`,
  handler: objectById
}
