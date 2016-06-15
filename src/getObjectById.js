'use strict'

module.exports = (db, id) =>
  new Promise((resolve, reject) => {
    const sql = `
      SELECT
        *
      FROM
        ae.object
      WHERE
        id = $1
    `
    db.client.query(sql, [id], (error, result) => {
      if (error) return reject(error)
      if (result && result.rows && result.rows[0]) {
        resolve(result.rows[0])
      } else {
        reject(`no object received from db`)
      }
    })
  })
