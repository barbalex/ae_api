'use strict'

const getObjectById = require(`../src/getObjectById.js`)
const getORCsByObjectId = require(`../src/getORCsByObjectId.js`)
const escapeStringForSql = require(`../src/escapeStringForSql.js`)

module.exports = (request, callback) => {
  const db = request.pg
  const id = escapeStringForSql(request.params.id)

  const data = {}

  getObjectById(db, id)
    .then((object) => {
      data.object = object
      return getORCsByObjectId(db, id)
    })
    .then((oRCs) => {
      data.oRCs = oRCs
      callback(null, data)
    })
    .catch((error) => callback(error, null))
}
