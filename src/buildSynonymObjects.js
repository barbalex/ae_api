const app = require('ampersand-app')
const getIdsOfSynonymsFromTaxonomicRcs = require('./getIdsOfSynonymsFromTaxonomicRcs.js')
const buildObject = require('./buildObject')

const buildSynonymObjects = (object) => new Promise((resolve, reject) => {
  if (
    object &&
    object.Beziehungssammlungen &&
    object.Beziehungssammlungen.length &&
    object.Beziehungssammlungen.length > 0
  ) {
    const rcs = object.Beziehungssammlungen
    // taxonomic relation collections
    const taxRcs = rcs.filter((rc) =>
      rc.Typ && rc.Typ === 'taxonomisch'
    )
    // synonym objects
    const guidsOfSynonyms = getIdsOfSynonymsFromTaxonomicRcs(taxRcs)
    const sql = `
      SELECT
        *
      FROM
        ae.object
      WHERE
        id IN ($1)
    `
    app.db.any(sql, guidsOfSynonyms)
      .then((synonymObjects) =>
        Promise.all(synonymObjects.map((so) => buildObject(so)))
      )
      .then((synonymObjectsBuilt) => resolve(synonymObjectsBuilt))
      .catch((error) =>
        reject('object.js: error fetching synonym objects:', error)
      )
  } else {
    resolve([])
  }
})

module.exports = buildSynonymObjects
