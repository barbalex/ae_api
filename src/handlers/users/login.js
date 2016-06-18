'use strict'

const Boom = require('boom')
const uuid = require('uuid')
const verifyUser = require('../../verifyUser.js')

module.exports = (request, reply) => {
  const { name, password } = request.payload
  verifyUser(name, password)
    .then((user) => {
      console.log('login.js, user', user)
      if (user === null || !Object.keys(user).length) {
        return reply(Boom.unauthorized(`Ungültiger Name oder Passwort`))
      }
      delete user.password
      // TODO: this produces an error
      // find out, how to create a session and make hapi return a cookie
      console.log(`request.auth`, request.auth)
      const sid = uuid.v4()
      request.cookieAuth.set({ sid })
      reply(`Willkommen ${user.name}!`)
    })
    .catch(() => reply(Boom.badImplementation()))
}
