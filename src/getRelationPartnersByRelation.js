'use strict'

const app = require('ampersand-app')

const sql = `
  SELECT
    object_id
  FROM
    ae.relation_partner
  WHERE
    relation_id = $1
`

module.exports = (relation_id) =>
  app.db.many(sql, [relation_id])
    .then((data) => {
      if (data) return data
      throw new Error(`no relation_partner received from db`)
    })
    .catch((error) => {
      throw error
    })
