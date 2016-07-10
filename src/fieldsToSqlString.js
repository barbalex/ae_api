'use strict'

module.exports = (fields, group) => {
  let sqlString = ''
  if (fields.length > 0) {
    const fArray = fields.map((f) => {
      if (f.property) {
        return `ae.${f.table}.properties->>'${f.field}'${group ? '' : ` AS "${f.field}"`}`
      }
      return `ae.${f.table}.${f.field}`
    })
    sqlString = fArray.join(',')
  }
  return sqlString
}
