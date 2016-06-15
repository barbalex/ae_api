/**
 * startet die Anwendung, indem der Server gestartet wird
 */

'use strict'

const createServer = require(`auto-sni`)
const Hapi = require(`hapi`)
const Inert = require(`inert`)
const dbConnection = require(`./dbConnection.js`)
const pgPlugin = require(`./pgPlugin.js`)
// wird nur in Entwicklung genutzt
// in new Hapi.Server() einsetzen
const serverOptionsDevelopment = {
  debug: {
    log: [`error`],
    request: [`error`]
  }
}
const server = new Hapi.Server(serverOptionsDevelopment)
const secureServer = createServer({
  email: `alex@gabriel-software.ch`, // Emailed when certificates expire.
  agreeTos: true, // Required for letsencrypt.
  debug: true, // Add console messages and uses staging LetsEncrypt server. (Disable in production)
  domains: [`artliste.ch`], // List of accepted domain names. (You can use nested arrays to register bundles with LE).
  forceSSL: true, // Make this false to disable auto http->https redirects (default true).
  ports: {
    http: 80, // Optionally override the default http port.
    https: 443 // // Optionally override the default https port.
  }
})
dbConnection.listener = secureServer
dbConnection.autoListen = false
dbConnection.tls = true
server.connection(dbConnection)

// non-Query routes hat to be separated
// because when testing directory handler produces an error
const routes = require(`./src/routes`).concat(require(`./src/nonQueryRoutes`))

server.register(Inert, (err) => {
  if (err) console.log(`failed loading Inert plugin`)
  server.register(pgPlugin, (error) => {
    if (error) console.log(`failed loading pg plugin`)
    // add all the routes
    server.route(routes)
  })
})

module.exports = server
