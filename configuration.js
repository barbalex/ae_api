/**
 * Hier werden zentral alle Konfigurationsparameter gesammelt
 */

'use strict'

const config = {}
const dbPass = require('./dbPass.json')

config.db = {}
config.pg = {}
config.pg.userName = dbPass.user
config.pg.passWord = dbPass.pass
config.pg.connectionString = `postgres://${dbPass.user}:${dbPass.pass}@localhost:5432/ae`

module.exports = config
