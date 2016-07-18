'use strict'

const app = require('ampersand-app')

module.exports = (parentId) =>
  new Promise((resolve, reject) => {
    const sql = `
      SELECT
        'taxonomy_object' as type,
        id,
        parent_id,
        name
      FROM
        ae.taxonomy_object
      WHERE
        parent_id = '${parentId}'
      ORDER BY
        name
    `
    app.db.many(sql)
      .then((data) => {
        if (data) return resolve(data)
        reject(`no data received from db`)
      })
      .catch((error) => reject(error))
  })
