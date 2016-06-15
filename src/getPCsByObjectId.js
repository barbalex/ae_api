'use strict'

const app = require(`ampersand-app`)

module.exports = (id) =>
  new Promise((resolve, reject) => {
    const sql = `
      SELECT
        *
      FROM
        ae.object_property_collection
      WHERE
        object_id = $1
    `
    app.db.many(sql, [id])
      .then((data) => {
        if (data) return resolve(data)
        reject(`no object_property_collections received from db`)
      })
      .catch((error) => reject(error))
  })
