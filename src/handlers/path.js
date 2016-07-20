'use strict'

const Boom = require('boom')
const getPathByObjectId = require('../getPathByObjectId.js')
const getPathByObjectIdUsingStandardTaxonomy = require('../getPathByObjectIdUsingStandardTaxonomy.js')

module.exports = (request, reply) => {
  const { taxonomyId, objectId } = request.params
  if (taxonomyId) {
    getPathByObjectId({ taxonomyId, objectId })
      .then((data) => reply(null, data))
      .catch((error) =>
        reply(Boom.badImplementation(error), null)
      )
  } else {
    getPathByObjectIdUsingStandardTaxonomy(objectId)
      .then((data) => reply(null, data))
      .catch((error) =>
        reply(Boom.badImplementation(error), null)
      )
  }
}
