'use strict'

const app = require(`ampersand-app`)

module.exports = (relation_id) =>
  new Promise((resolve, reject) => {
    const sql = `
      SELECT
        object_id
      FROM
        ae.relation_partner
      WHERE
        relation_id = $1
    `
    app.db.many(sql, [relation_id])
      .then((data) => {
        if (data) return resolve(data)
        reject(`no relation_partner received from db`)
      })
      .catch((error) => reject(error))
  })
