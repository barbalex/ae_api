'use strict'

const app = require('ampersand-app')

const sql = `
  SELECT
    *
  FROM
    ae.category
`

module.exports = () =>
  app.db.any(sql)
    .then((data) => {
      const categories = data.map((c) => ({
        type: 'category',
        id: c.name,
        parent_id: 'root',
        name: c.name,
        path: [c.name]
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
      if (categories.length > 1) return categories
      throw new Error(`no data received from db`)
    })
    .catch((error) => {
      throw error
    })
