'use strict'

const Boom = require(`boom`)
const verifyUser = require(`../src/verifyUser.js`)

module.exports = (request, reply) => {
  const { name, password } = request.params
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
