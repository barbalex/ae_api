'use strict'

const getObjectById = require(`../src/getObjectById.js`)
const getORCsByObjectId = require(`../src/getORCsByObjectId.js`)
const getPCsByObjectId = require(`../src/getPCsByObjectId.js`)
const escapeStringForSql = require(`../src/escapeStringForSql.js`)

module.exports = (request, callback) => {
  const id = escapeStringForSql(request.params.id)

  const data = {}

  getObjectById(id)
    .then((object) => {
      data.object = object
      return getORCsByObjectId(id)
    })
    .then((oRCs) => {
      data.oRCs = oRCs
      return //getPCsByObjectId(id)
    })
    /*.then((oPCs) => {
      data.oPCs = oPCs
      return
    })*/
    .then(() => callback(null, data))
    .catch((error) => callback(error, null))
}
