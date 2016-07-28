'use strict'

const Boom = require('boom')
const getObjectById = require('../getObjectById.js')
const buildObject = require('../buildObject.js')

module.exports = (request, reply) => {
  const { id } = request.params

  getObjectById(id)
    .catch(() =>
      reply(Boom.badRequest(
        `Es existiert kein Objekt mit der id '${id}'.`
      ))
    )
    .then((data) =>
      buildObject(data)
    )
    .then((objectData) => {
      reply(null, objectData)
    })
    .catch((error) =>
      reply(Boom.badImplementation(error), null)
    )
}
