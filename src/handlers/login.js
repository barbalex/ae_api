'use strict'

const Boom = require('boom')
const verifyUser = require('../verifyUser.js')

module.exports = (request, reply) => {
  const { name, password } = request.params
  console.log(`name`, name)
  console.log(`password`, password)
  verifyUser(name, password)
    .then((user) => {
      if (!user) {
        return reply(Boom.unauthorized(`Ungültiger Name oder Passwort`))
      }
      delete user.password
      request.auth.session.set(user)
      return reply(`Login Successful!`)
    })
    .catch(() => reply(Boom.badImplementation()))
}
