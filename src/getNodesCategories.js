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
    app.db.many(sql)
      .then((data) => {
        const categories = data.map((d) => ({
          type: 'category',
          id: d.name,
          parent_id: null,
          name: d.name,
        }))
        if (categories) return resolve(categories)
        reject(`no data received from db`)
      })
      .catch((error) => reject(error))
  })
