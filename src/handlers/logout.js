'use strict'

module.exports = (request, reply) => {
  request.auth.session.clear()
  return reply(`erfolgreich abgemeldet`)
}
