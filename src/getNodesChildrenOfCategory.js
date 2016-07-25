'use strict'

const app = require('ampersand-app')

module.exports = (category) =>
  new Promise((resolve, reject) => {
    const sql = `
      SELECT
        'taxonomy' as type,
        id,
        name,
        category AS parent_id
      FROM
        ae.taxonomy
      WHERE
        category = '${category}'
      ORDER BY
        name
    `
    app.db.any(sql)
      .then((data) => {
        data.forEach((d) => {
          d.path = [d.parent_id, d.id]
        })
        if (data) return resolve(data)
        reject(`no data received from db`)
      })
      .catch((error) => reject(error))
  })
