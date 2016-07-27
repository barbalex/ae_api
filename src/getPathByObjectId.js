/**
 * receives an object id and a taxonomy id
 * returns the path of the object in this taxonomy
 */

const app = require('ampersand-app')

module.exports = ({ taxonomyId, objectId }) =>
  new Promise((resolve, reject) => {
    let path
    let pathWithIds
    const sql = `
    SELECT
      id,
      name
    FROM
      ae.taxonomy_object
    WHERE
      id IN (
        WITH RECURSIVE tree AS (
          SELECT
            ae.taxonomy_object.id,
            object_id,
            ARRAY[]::uuid[] AS path
          FROM
            ae.taxonomy_object
          WHERE
            parent_id IS NULL AND
            taxonomy_id = $1

          UNION ALL

          SELECT
            ae.taxonomy_object.id,
            ae.taxonomy_object.object_id,
            tree.path || ae.taxonomy_object.parent_id
          FROM
            ae.taxonomy_object,
            tree
          WHERE
            ae.taxonomy_object.parent_id = tree.id AND
            ae.taxonomy_object.taxonomy_id = $1
        )
        SELECT
          unnest(path)
        FROM
          tree
        WHERE
          object_id = $2
      )
    `
    app.db.many(sql, [taxonomyId, objectId])
      .then((data) => {
        pathWithIds = data
        path = pathWithIds.map((p) => p.name)
        // get Taxonomy
        return app.db.one(`
          SELECT
            name,
            category
          FROM
            ae.taxonomy
          WHERE
            id = $1
          `,
          taxonomyId
        )
      })
      .then((result) => {
        path.unshift(result.name)
        path.unshift(result.category)
        path.unshift('root')
        resolve(path)
      })
      .catch((error) => reject(error))
  })
