'use strict'

/**
 * this is used for the SELECT line (without group)
 * and also for the group line (with group = true)
 * in the group line no 'AS' may appear
 */

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
