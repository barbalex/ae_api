'use strict'

const Boom = require('boom')
const getObjectById = require('../getObjectById.js')
const getTaxonomyId = require('../getTaxonomyId.js')
const getPathByObjectId = require('../getPathByObjectId.js')
const getPathByObjectIdUsingStandardTaxonomy = require('../getPathByObjectIdUsingStandardTaxonomy.js')

module.exports = (request, reply) => {
  const { taxonomyId, objectId } = request.params
  // make sure there exists an object with objectId
  getObjectById(objectId)
    .catch(() =>
      reply(Boom.badRequest(
        `Es existiert kein Objekt mit der id '${objectId}'.`
      ))
    )
    .then(() => {
      if (taxonomyId) {
        // make sure there exists a taxonomy with taxonomyId
        getTaxonomyId(taxonomyId)
          .catch(() =>
            reply(Boom.badRequest(
              `Es existiert kein Taxonomie-Objekt mit der id '${taxonomyId}'.`
            ))
          )
          .then(() =>
            getPathByObjectId({ taxonomyId, objectId })
          )
          .then((data) =>
            reply(null, data)
          )
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
    })
}
