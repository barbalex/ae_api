/**
 * receives an object id and a taxonomy id
 * returns the path of the object in this taxonomy
 */

const app = require('ampersand-app')

module.exports = (objectId) =>
  new Promise((resolve, reject) => {
    let path
    let pathWithIds
    let taxonomyId
    let taxonomyName
    let category
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
    app.db.one(`
      SELECT
        ae.taxonomy.id,
        ae.taxonomy.name,
        ae.taxonomy.category
      FROM
        ae.taxonomy
        INNER JOIN
          ae.taxonomy_object
          ON ae.taxonomy_object.taxonomy_id = ae.taxonomy.id
      WHERE
        ae.taxonomy_object.object_id = $1 AND
        ae.taxonomy.is_category_standard = 'true'
      `,
      objectId
    )
      .then((result) => {
        taxonomyId = result.id
        taxonomyName = result.name
        category = result.category
        return app.db.many(sql, [taxonomyId, objectId])
      })
      .then((data) => {
        pathWithIds = data
        path = pathWithIds.map((p) => p.name)
        path.unshift(taxonomyName)
        path.unshift(category)
        resolve(path)
      })
      .catch((error) => reject(error))
  })
