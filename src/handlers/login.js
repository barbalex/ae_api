'use strict'

const Boom = require(`boom`)

module.exports = (request, reply) => {
  verifyUser(request.payload.email, request.payload.password)
    .then((user) => {
      if (user) {
        request.auth.session.set(user)
        return reply(`Login Successful!`)
      }
      return reply(Boom.unauthorized(`Ungültiger Name oder Passwort`))
    })
    .catch(() => reply(Boom.badImplementation()))
}
