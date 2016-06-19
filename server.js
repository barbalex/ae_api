/**
 * startet die Anwendung, indem der Server gestartet wird
 */

'use strict'

const Hapi = require('hapi')
const Inert = require('inert')
const Vision = require('vision')
const Lout = require('lout')
const HapiAuthCookie = require('hapi-auth-cookie')
const glob = require('glob')
const path = require('path')
const dbConnection = require('./dbConnection.js')()
const cookiePassword = require('./cookiePassword.js')
// wird nur in Entwicklung genutzt
// in new Hapi.Server() einsetzen
let serverOptions = {
  debug: {
    log: [`error`],
    request: [`error`]
  }
}
if (process.env.NODE_ENV === `production`) {
  serverOptions = {}
  const createServer = require(`auto-sni`)
  const secureServer = createServer({
    email: `alex@gabriel-software.ch`, // Emailed when certificates expire
    agreeTos: true, // Required for letsencrypt
    debug: true, // Add console messages and uses staging LetsEncrypt server. (Disable in production)
    domains: [`artliste.ch`], // List of accepted domain names. (You can use nested arrays to register bundles with LE)
    forceSSL: true, // Make this false to disable auto http->https redirects (default true)
    ports: {
      http: 80, // Optionally override the default http port
      https: 443 // Optionally override the default https port
    }
  })
  // Server is a "https.createServer" instance.
  secureServer.once(`listening`, () => {
    console.log(`We are ready to go.`)
  })
  // add auto-sni methods to dbConnection
  dbConnection.listener = secureServer
  dbConnection.autoListen = false
  dbConnection.tls = true
}
const server = new Hapi.Server(serverOptions)
server.connection(dbConnection)

const loutConfig = {
  register: Lout,
  options: {
    endpoint: `api`
  }
}

server.register([Inert, HapiAuthCookie, Vision, loutConfig], (error) => {
  if (error) console.log(`failed loading server plugins`)
  server.auth.strategy(`session`, `cookie`, true, {
    password: cookiePassword,
    cookie: `ae-cookie`,
    ttl: 24 * 60 * 60 * 1000, // set session to 1 day
    isSecure: process.env.NODE_ENV !== 'development' // bad idea but necessary to run on http
  })
  // add all the routes
  glob.sync(`src/routes/**/*.js`, { root: __dirname }).forEach((file) =>
    server.route(require(path.join(__dirname, file)))
  )
  // non-Query routes hat to be separated
  // because when testing directory handler produces an error
  glob.sync(`src/nonQueryRoutes/**/*.js`, { root: __dirname }).forEach((file) =>
    server.route(require(path.join(__dirname, file)))
  )
})

module.exports = server
