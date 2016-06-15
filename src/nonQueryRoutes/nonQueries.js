'use strict'

module.exports = [
  {
    method: `GET`,
    path: `/{path*}`,
    handler(request, reply) {
      reply.file(`index.html`)
    }
  },
  {
    method: `GET`,
    path: `/src/{param*}`,
    handler: {
      directory: {
        path: `src`
      }
    }
  },
  {
    method: `GET`,
    path: `/style/{param*}`,
    handler: {
      directory: {
        path: `style`
      }
    }
  },
  {
    method: `GET`,
    path: `/style/images/{param*}`,
    handler: {
      directory: {
        path: `style/images`
      }
    }
  }
]
