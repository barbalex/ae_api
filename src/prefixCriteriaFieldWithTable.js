'use strict'

module.exports = (criteria, tablename) => criteria.map((oc) => {
  oc.field = `ae.${tablename}.${oc.field}`
  return oc
})
