'use strict'

const app = require('ampersand-app')

module.exports = (id) => {
  const whereClause = (
    id ?
    `WHERE id = '${id}'` :
    ''
  )
  const sql = `
    SELECT
      'taxonomy' as type,
      id,
      name,
      category AS parent_id
    FROM
      ae.taxonomy
    ${whereClause}
    ORDER BY
      name
  `
  return app.db.many(sql)
    .then((data) => {
      data.forEach((d) => {
        d.path = [d.parent_id, d.id]
      })
      if (data) return data
      throw new Error(`no data received from db`)
    })
    .catch((error) => {
      throw error
    })
}
