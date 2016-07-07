'use strict'

module.exports = (criteria) => {
  let sqlString = ''
  if (
    criteria &&
    criteria.length &&
    criteria.length > 0
  ) {
    const cArray = criteria.map((c) => {
      const value = isNaN(c.value) ? `'${c.value}'` : c.value
      const comparator = c.comparator || '='
      return `${c.field}${comparator}${value}`
    })
    sqlString = ` WHERE ${cArray.join(' AND ')}`
  }
  return sqlString
}
