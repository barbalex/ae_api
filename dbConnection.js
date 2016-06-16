'use strict'

module.exports = () => {
  const connection = {
    host: `0.0.0.0`,
    routes: {
      cors: true
    }
  }
  if (process.env.NODE_ENV === `development`) {
    connection.port = 8000
  }
  return connection
}
