'use strict'

const app = require('ampersand-app')
const Boom = require('boom')
const getUsers = require('../../getUsers.js')
const hashPassword = require('../../hashPassword.js')

module.exports = (request, reply) => {
  const { name, email, password } = request.payload
  const admin = false

  hashPassword(password, (error, hash) => {
    if (error) throw Boom.badRequest(error)
    const user = {
      name,
      email,
      password: hash
    }
    // save user in db
  })

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
