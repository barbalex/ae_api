'use strict'

const app = require('ampersand-app')

module.exports = (id) =>
  new Promise((resolve, reject) => {
    const sql = `
      SELECT
        ae.taxonomy.category
      FROM
        ae.taxonomy_object
        INNER JOIN
          ae.taxonomy
          ON ae.taxonomy.id = ae.taxonomy_object.taxonomy_id
      WHERE
        ae.taxonomy_object.id = '${id}'
    `
    app.db.oneOrNone(sql)
      .then((data) => {
        if (data && data.category) return resolve(data.category)
        reject(`no data received from db`)
      })
      .catch((error) => reject(error))
  })
