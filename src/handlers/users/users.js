'use strict'

const Boom = require('boom')
const getUsers = require('../../getUsers.js')

module.exports = (request, reply) => {
  getUsers()
    .then((users) => {
      if (users && users.length) {
        return reply(null, users)
      }
      throw `no users received`  /* eslint no-throw-literal:0 */
    })
    .catch((error) =>
      reply(Boom.badImplementation(error), null)
    )
}
