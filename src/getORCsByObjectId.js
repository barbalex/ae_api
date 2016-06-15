'use strict'

module.exports = (db, id) =>
  new Promise((resolve, reject) => {
    const sql = `
      SELECT
        *
      FROM
        ae.object_relation_collection
      WHERE
        object_id = $1
    `
    db.client.query(sql, [id], (error, result) => {
      if (error) return reject(error)
      if (result && result.rows) {
        resolve(result.rows)
      } else {
        reject(`no object_relation_collections received from db`)
      }
    })
  })
