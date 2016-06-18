'use strict'

const app = require('ampersand-app')
const Boom = require('boom')

module.exports = (request, reply) => {
  const { name, email } = request.payload
  /**
   * Check whether the username or email
   * is already taken and error out if so
   */
  const sql = `
    SELECT
      *
    FROM
      ae.user
  `
  app.db.many(sql)
    .then((users) => {
      const userWithSameName = users.find((user) => user.name === name)
      const userWithSameEmail = users.find((user) => user.email === email)
      if (userWithSameName) {
        reply(Boom.badRequest('Der Benutzername wird schon verwendet'))
      } else if (userWithSameEmail) {
        reply(Boom.badRequest('Die Email-Adresse wird schon verwendet'))
      } else {
        /**
         * everything checks out, so send the payload through
         * to the route handler
         */
        reply(request.payload)
      }
    })
    .catch((error) =>
      reply(Boom.badImplementation(error))
    )
}
