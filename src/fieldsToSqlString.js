'use strict'

module.exports = (fields) => {
  let sqlString = ''
  if (fields.length > 0) {
    const fArray = fields.map((f) =>
      `ae.${f.table}.${f.field}`
    )
    sqlString = fArray.join(',')
  }
  return sqlString
}
