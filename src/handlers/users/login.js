'use strict'

const Boom = require('boom')
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
      request.auth.session.set(user)
      return reply(`Login Successful!`)
    })
    .catch(() => reply(Boom.badImplementation()))
}
