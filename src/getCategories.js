'use strict'

const app = require('ampersand-app')

module.exports = () =>
  new Promise((resolve, reject) => {
    const sql = `
      SELECT
        *
      FROM
        ae.category
    `
    app.db.any(sql)
      .then((data) => {
        const categories = data.map((d) => d.name)
        resolve(categories)
      })
      .catch((error) => reject(error))
  })
