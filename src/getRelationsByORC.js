'use strict'

const app = require(`ampersand-app`)

module.exports = (object_id, relation_collection_id) =>
  new Promise((resolve, reject) => {
    const sql = `
      SELECT
        *
      FROM
        ae.relation
      WHERE
        object_id = $1 AND
        relation_collection_id = $2
    `
    app.db.many(sql, [object_id, relation_collection_id])
      .then((data) => {
        if (data) return resolve(data)
        reject(`no relations received from db`)
      })
      .catch((error) => reject(error))
  })
