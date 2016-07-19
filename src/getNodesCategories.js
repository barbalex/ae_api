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
          parent_id: 'root',
          name: d.name,
        }))
        /**
         * for d3-hierarchy's stratify to work on all nodes
         * there needs to be a single root node
         */
        categories.unshift({
          id: 'root',
          parent_id: null,
          name: 'root',
        })
        if (categories.length > 1) return resolve(categories)
        reject(`no data received from db`)
      })
      .catch((error) => reject(error))
  })
