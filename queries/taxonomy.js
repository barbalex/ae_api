'use strict'

module.exports = (request, callback) => {
  const sql = `
    SELECT
      *
    FROM
      ae.taxonomy
    ORDER BY
      name`
  request.pg.client.query(sql, (error, result) => callback(error, result.rows))
}
