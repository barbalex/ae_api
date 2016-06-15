'use strict'

const app = require(`ampersand-app`)

module.exports = (id) =>
  new Promise((resolve, reject) => {
    const sql = `
      SELECT
        *
      FROM
        ae.object_relation_collection
      WHERE
        object_id = $1
    `
    app.db.many(sql, [id])
      .then((result) => {
        if (result) return resolve(result)
        reject(`no object_relation_collections received from db`)
      })
      .catch((error) => reject(error))
  })
