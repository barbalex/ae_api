/**
 * startet die Anwendung, indem der Server gestartet wird
 */

'use strict'

const app = require(`ampersand-app`)
const server = require(`./server.js`)
const pgp = require(`pg-promise`)()
const config = require(`./configuration.js`)

server.start((err) => {
  if (err) throw err
  const db = pgp(config.pg.connectionString)
  app.extend({
    init() {
      this.db = db
    }
  })
  app.init()
  console.log(`Server running at:`, server.info.uri)
})
