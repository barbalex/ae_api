'use strict'

const app = require('ampersand-app')
const Boom = require('boom')
const hashPassword = require('../../hashPassword.js')

module.exports = (request, reply) => {
  const { name, email, password } = request.payload

  hashPassword(password)
    // save user in db
    .then((hash) =>
      app.db.none(`
        INSERT INTO ae.user (name,email,password)
        VALUES ('${name}','${email}','${hash}')
      `)
    )
    .then(() =>
      reply(`Ein neuer Benutzer Namens ${name} wurde erstellt`)
    )
    .catch((error) =>
      reply(Boom.badImplementation(error), null)
    )
}
