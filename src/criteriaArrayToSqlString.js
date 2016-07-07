'use strict'

module.exports = (criteria) => {
  let sqlString = ''
  if (
    criteria &&
    criteria.length &&
    criteria.length > 0
  ) {
    const cArray = criteria.map((c) => `${c.field}${c.comparator || '='}${c.value}`)
    sqlString = ` WHERE ${cArray.join(' AND ')}`
  }
  return sqlString
}
