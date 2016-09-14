/**
 * receives an object id and a taxonomy id
 * returns the path of the object in this taxonomy
 */

const app = require('ampersand-app')
const getTaxonomyObjectFromId = require('./getTaxonomyObjectFromId.js')

module.exports = (id) => {
  let path
  let pathWithIds
  let taxObject
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
            parent_id IS NULL

          UNION ALL

          SELECT
            ae.taxonomy_object.id,
            ae.taxonomy_object.object_id,
            tree.path || ae.taxonomy_object.parent_id
          FROM
            ae.taxonomy_object,
            tree
          WHERE
            ae.taxonomy_object.parent_id = tree.id
        )
        SELECT
          unnest(path)
        FROM
          tree
        WHERE
          id = $1
      )
    `
  return app.db.many(sql, id)
    .then((data) => {
      pathWithIds = data
      path = pathWithIds.map((p) => p.name)
      return getTaxonomyObjectFromId(id)
    })
    .then((taxObjectPassed) => {
      taxObject = taxObjectPassed
      // get Taxonomy
      return app.db.one(`
        SELECT
          ae.taxonomy.name,
          ae.taxonomy.category
        FROM
          ae.taxonomy
          INNER JOIN ae.taxonomy_object
          ON ae.taxonomy.id = ae.taxonomy_object.taxonomy_id
        WHERE
          ae.taxonomy_object.id = $1
        `,
        id
      )
    })
    .then((result) => {
      path.unshift(result.name)
      path.unshift(result.category)
      path.push(taxObject.name)
      return path
    })
    .catch(() => null)
}
