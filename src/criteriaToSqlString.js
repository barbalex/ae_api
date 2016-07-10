'use strict'

module.exports = (criteria) => {
  let sqlString = ''
  if (criteria.length > 0) {
    const cArray = criteria.map((c) => {
      const value = isNaN(c.value) ? `'${c.value}'` : c.value
      const comparator = c.comparator || '='
      return `ae.${c.table}${c.field}${comparator}${value}`
    })
    sqlString = `WHERE ${cArray.join(' AND ')}`
  }
  return sqlString
}
