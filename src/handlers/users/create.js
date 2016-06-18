'use strict'

const app = require('ampersand-app')
const Boom = require('boom')
const hashPassword = require('../../hashPassword.js')

module.exports = (request, reply) => {
  const { name, email, password } = request.payload

  hashPassword(password, (error, hash) => {
    if (error) throw Boom.badRequest(error)
    const sql = `
      INSERT INTO ae.user (name,email,password)
      VALUES ('${name}','${email}','${hash}')
    `
    // save user in db
    app.db.none(sql)
      .then(() => {
        reply(`Ein neuer Benutzer Namens ${name} wurde erstellt`)
      })
      .catch((error3) =>
        reply(Boom.badImplementation(error3), null)
      )
  })
}
