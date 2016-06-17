'use strict'

const Boom = require(`boom`)

module.exports = (request, reply) => {
  getValidatedUser(request.payload.email, request.payload.password)
    .then((user) => {
      if (user) {
        request.auth.session.set(user)
        return reply(`Login Successful!`)
      }
      return reply(Boom.unauthorized(`Bad email or password`))
    })
    .catch(() => reply(Boom.badImplementation()))
}
