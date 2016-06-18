'use strict'

const app = require('ampersand-app')
const Boom = require('boom')
const uuid = require(`node-uuid`)
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
      .then((user) => {
        // build session id
        const sid = uuid.v4()
        // TODO: Error because request.server.app.cache does not exist!
        // search how to set cookie session in hapi
        console.log('request.server.app', request.server.app)
        console.log('request.state', request.state)
        request.server.app.cache.set(sid, user, 0, (error2) => {
          if (error2) reply(error2)
          reply(request.cookieAuth.set({ sid })).code(201)
        })
      })
      .catch((error3) =>
        reply(Boom.badImplementation(error3), null)
      )
  })
}
