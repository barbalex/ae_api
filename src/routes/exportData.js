'use strict'

const exportData = require('../exportData.js')

module.exports = {
  method: `GET`,
  path: `/exportData/{combineTaxonomies}/{oneRowPerRelation}/{includeDataFromSynonyms}/{onlyObjectsWithCollectionData}/{exportOptions}`,
  handler: exportData
}
